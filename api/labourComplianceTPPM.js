const { apiTokenAutomate } = require('../middleware/apiToken');
const { getUnits } = require('./Mapal');
const { getMapalEmployees } = require('./Mapal');
const { getWorkedHours } = require('./Mapal');
const { getHoursFondCompliance } = require('./Mapal');
const { getEmployeeLabourState } = require('./Mapal');
const { getTerminatedEmployees } = require('./Mapal');
const { getEmployeeData } = require('./Mapal');
const { getEmployeeDetails } = require('./Mapal');
const { getContractedHours } = require('./Mapal');
const { getAbsences } = require('./Mapal');
const moment = require("moment");
const Employee = require('../model/Employee');
const { get } = require('mongoose');
const { makeMngOvertimeEmail } = require('../utils/mngOvertimeEmail');
const { ca } = require('date-fns/locale');
const sendEmail = require("../utils/sendEmployeeEmail");
const sendEmailOffice = require("../utils/sendEmployeeEmailOffice");

const labourComplianceTPPM = async (start, end, email, cc= []) => {
    await apiTokenAutomate();
    const currentDate = new Date();
    const startOfMonth = new Date(moment(currentDate).startOf('month').format('YYYY-MM-DD'));
    const endOfCurrentmonth = new Date(moment(currentDate).endOf('month').format('YYYY-MM-DD'));
    //dates for the annual overtime of maangers
    const startOfyear = new Date(moment(startOfMonth).startOf('year').format('YYYY-MM-DD'));
    
   // console.log('Start YEAR:', startOfyear, 'End Date of Current Month:', endOfCurrentmonth);

    const units = await getUnits();
   // console.log('Units:', units);
    
   //const filteredUnits = units.filter(unit => unit.business_unit_id === 13);
    
   const filteredUnits = units.filter(unit =>
        unit.business_unit !== 'KFC Office' &&
        unit.business_unit !== 'KFC Wörgl' &&
        unit.business_unit !== 'KFC Lugner City' &&
        unit.business_unit !== 'KFC Novum Prešov'
    ).slice(start, end); // Limit to one unit for testing
    

    //get terminated employees
     const termEmpInfo = await getTerminatedEmployees(startOfMonth, endOfCurrentmonth);
     const termEmpIds = termEmpInfo.map(emp => emp.employee_id);
     //console.log('terminated Ids', termEmpInfo)
    //only called if ther are term emoIds
     let employeeData = [];
        if (termEmpIds.length > 0) {
            employeeData = await getEmployeeData(termEmpIds);
        }
     const terminated = employeeData.map(emp => {
            const termInfo = termEmpInfo.find(t => t.employee_id === emp.employee_id);
        return {
            employee_id: emp.employee_id,
            unit_id: termInfo.workcenter_id,
            job: termInfo.category,
            name: emp.name,
            last_name: emp.last_name,
        }
     })

   
    //gets All hired employees to the current date and combined woth terminated employees
    const employees = await getMapalEmployees();
    const allEmployees = [...terminated,...employees];
    const onlyTPPMall = allEmployees.filter(emp => emp.job !== 'Student' && emp.job !== 'Part Timer' && emp.job !== 'Team Member');
    //const filt = employees.filter(emp => emp.unit_id === 13);
    ///console.log('Employees:', onlyTPPM);


    const unitDataPromises = filteredUnits.map( async unit => {
        const filteredEmployees = onlyTPPMall.filter(emp => emp.unit_id === unit.business_unit_id);
        const employeeIds = filteredEmployees.map(emp => emp.employee_id);
       // console.log('Employee IDs current:', employeeIds.length);
        //const employeeIds = [...employeeIdsCurr,...termEmpIds];

        const empState = await getEmployeeLabourState(employeeIds);
        // console.log('State:', empState);


        const empDetails = employeeIds.map( async empId => {
            const emp = await getEmployeeDetails(empId);
            /*
            HERE WE NEED TO CHECK THE CURRENT ACTIVE PERIOD LABORAL SITUATION - since we are taking only the [0] yero onef the active periods
            emp.active_periods[0].laboral_situation.forEach(period => {
                console.log('Employee:', emp.name, emp.last_name, 'State:', period.contract_type, 'Start Date:', period.date);
            })
            */
            //find the current laboral situation of the employee
            const currentPeriod = empState.find(state => state && state.employee_id === empId);
            const currentEmpStates = emp.active_periods[0].laboral_situation.filter(period => period.contract_type === currentPeriod.contract);
            //loop through the laboral situations and compare the start days and returnt the oldes one
            const oldestPeriod = currentEmpStates.reduce((oldest, current) => {
                const currentStartDate = new Date(current.date);
                if (!oldest || currentStartDate < new Date(oldest.date)) {
                    return current;
                }
                return oldest;
            }, null);

            return {
                employee_id: empId,
                name: emp.name,
                last_name: emp.last_name,
                labourSituations: emp.active_periods[0].laboral_situation,
                oldestPeriod: oldestPeriod.date,
            }
          });

        const employeesDetails = await Promise.all(empDetails);

       // console.log('Employee Details:', employeesDetails);
        
        months = getCurrentYearMonths();
        //console.log(months);

        const employeeMonthsPromises = months.map( async month =>{

            const startOfMonth = new Date(moment(month).startOf('month').format('YYYY-MM-DD'));
            const endOfMonth = new Date(moment(month).endOf('month').format('YYYY-MM-DD'));
            
           // console.log('Start of Month:', startOfMonth, 'End of Month:', endOfMonth);

            const fondHours = await getHoursFondCompliance(startOfMonth, endOfMonth, employeeIds);
                       // console.log('Fond:', fond.length, 'Employee ID:', empId);
                       

            const workedHours = [];
            for (const empId of employeeIds) {
                //find employee state start date
                const currentEmpState = employeesDetails.find(state => state && state.employee_id === empId);
                const startDate = currentEmpState ? new Date(moment(currentEmpState.oldestPeriod).format('YYYY-MM-DD')) : null;
               // console.log('Current Employee State:', startDate, 'Employee ID:', empId);
                
                if( startDate >= startOfMonth && startDate <= endOfMonth) {

                    const hours = await getWorkedHours(startDate, endOfMonth, empId);
                        // If getWorkedHours returns an array, use spread; if object, just push
                        if (Array.isArray(hours)) {
                         //   console.log('Hours:', hours.length, 'Employee ID:', empId);
                            workedHours.push(...hours);
                        } else if (hours) {
                            workedHours.push(hours);
                        }
                } else {
                   // console.log('Employee:', empId, 'has no hours in the current month' , startOfMonth, endOfMonth);
                } 
                
                if (startDate < startOfMonth) {
                    const hours = await getWorkedHours(startOfMonth, endOfMonth, empId);
                     //   console.log('Hours:', hours.length, 'Employee ID:', empId);
                        // If getWorkedHours returns an array, use spread; if object, just push
                        if (Array.isArray(hours)) {
                            workedHours.push(...hours);
                        } else if (hours) {
                            workedHours.push(hours);
                        }
                } else {
                    //console.log('Employee:', empId, 'has no state in the current month');
                }
            }
            
            //const hoursFond = await getHoursFondCompliance(startOfMonth, endOfMonth, employeeIds);
            // console.log('Hours Fond:', hoursFond.length);

            return {
                startOfMonth: startOfMonth,
                endOfMonth: endOfMonth,
                workedHours: workedHours.length ? workedHours : [ { total_time: 0 } ],
                fondHours: fondHours.length ? fondHours : [ { result: 0 } ],
                currentEmpState: empState
            }

        });
         
        const employeeMonthsData = await Promise.all(employeeMonthsPromises);
        /*
      // console.log('Employee Months Data:', employeeMonthsData);
       employeeMonthsData.forEach(monthData => {
        console.log('Start', monthData.startOfMonth,
                    'Worked Hours', monthData.workedHours[0].total_time,
                    'Fond Hours', monthData.fondHours[0].result,
                'Current Employee State:', monthData.currentEmpState[0].contract,
            'current Employee State Start Date:', monthData.currentEmpState[0].start_date)
        //console.log('Month:', monthData.startOfMonth, 'Worked Hours:', monthData.workedHours.length, 'Fond Hours:', monthData.fondHours.length);
       })
        */


        const unitEmployeesData = filteredEmployees.map(emp => {

            const filteredFondAndHoursByMonth = employeeMonthsData.map( month =>{
                const hours = month.workedHours.filter(hours => hours.id_employee === emp.employee_id);
                const fond = month.fondHours.filter(fond => fond.employee_id === emp.employee_id);
        
                return {
                    startOfMonth: month.startOfMonth,
                    workedHours: hours.length ? hours[0].total_time : [ { total_time: 0 } ],
                    fondHours: fond.length ? fond[0].result : [ { result: 0 } ],
                    overtime: (hours.length ? hours[0].total_time : 0) - (fond.length ? fond[0].result : 0),
                }
            });

            //OvertimeSum pf Allmonths
            const overtimeSum = filteredFondAndHoursByMonth.reduce((sum, month) => {
                const overtime = (month.workedHours - month.fondHours).toFixed(2);
                if (overtime > 0) {
                    return sum + (Number(overtime) || 0);
                }   
                return sum;
            }, 0);
            

            return {
                employeeId: emp.employee_id,
                unitId: emp.unit_id,
                employee: `${emp.name} ${emp.last_name}`,
                state: empState.filter(state => state && state.employee_id === emp.employee_id),
                filteredFondAndHoursByMonth: filteredFondAndHoursByMonth,
                overtimeSum: overtimeSum,
            }
        });
               

        const employeeData = await Promise.all(unitEmployeesData);

       // console.log('Unit', unit.business_unit, 'OvertimeTotal', overtimeSum, 'MinusHoursSum', minusHoursSum);

        return {
                unitId: unit.business_unit_id,
                unitName: unit.business_unit,
                employees: employeeData
        };


    });
   
   const unitData  = await Promise.all(unitDataPromises);
   

   try {
        //console.log('Unit Data:', unitData);
        if(unitData.length > 0) {
            //console.log('Unit Data Length:', unitData.length);
           const html = makeMngOvertimeEmail(unitData);
            const subject = `KFC Managers Overtime YTD - ${endOfCurrentmonth.toLocaleDateString()}`;
               
           // console.log(unit.email)
            const info = await sendEmailOffice(
              email,
                cc,
                subject,
                html
              );

              if (info.messageId) {
                console.log("Message sent");
              } else {
                console.log("Message was not sent");
              }
        }

    } catch (error) {
        console.error('Error in makeMngOvertimeEmail:', error);
    }




  // console.log('Employee Data:', unitData);
    
    /*
   unitData.forEach(unit => {
    unit.employees.filter(e => e.state[0].contract === 'TPPM').forEach element => {

        console.log('Employee:', element.employee,
                    'State:', element.state[0].contract,
                    'StateStart:', element.state[0].start_date, 
                    'Filtered Fond and Hours By Month:', element.filteredFondAndHoursByMonth.length,
                    'Overtime Sum:', element.overtimeSum  
            )}
    );
   })  
    */

}



function getCurrentYearMonths () {
    const currentDate = new Date();
    const startOfMonth = new Date(moment(currentDate).startOf('month').format('YYYY-MM-DD'));
    const endOfCurrentmonth = new Date(moment(currentDate).endOf('month').format('YYYY-MM-DD'));
    //dates for the annual overtime of maangers 
    const startOfyear = new Date(moment(startOfMonth).startOf('year').format('YYYY-MM-DD'));

    //get Months for the year starting from start of the year to the end of year
    const months = [];

    for (let i = 0; i < 12; i++) {
        const month = new Date(startOfyear);
        month.setMonth(month.getMonth() + i);
        months.push(month);
    } 

    return  months ;
} 

module.exports = {
    labourComplianceTPPM
};

