const { apiTokenAutomate } = require('../middleware/apiToken');
const { getUnits } = require('../api/Mapal');
const { getMapalEmployees } = require('../api/Mapal');
const { getWorkedHours } = require('../api/Mapal');
const { getHoursFondCompliance } = require('../api/Mapal');
const { getEmployeeLabourState } = require('../api/Mapal');
const { getTerminatedEmployees } = require('../api/Mapal');
const { getEmployeeData } = require('../api/Mapal');
const { getContractedHours } = require('../api/Mapal');
const { getAbsences } = require('../api/Mapal');
const moment = require("moment");
const Employee = require('../model/Employee');
const { get } = require('mongoose');

const labourCompliance = async (date1, date2) => {
    await apiTokenAutomate();
    const currentDate = new Date();
    const start = new Date(date1);
    const end = new Date(date2);
    //dates for the annual overtime of maangers
    const startOfyear = new Date(moment(start).startOf('year').format('YYYY-MM-DD'));
    const endOfCurrentmonth = new Date(moment(currentDate).endOf('month').format('YYYY-MM-DD'));
   // console.log('Start YEAR:', startOfyear, 'End Date of Current Month:', endOfCurrentmonth);

    const units = await getUnits();
    //console.log('Units:', units);
   //const filteredUnits = units.filter(unit => unit.business_unit_id === 13);
   
   const filteredUnits = units.filter(unit =>
        unit.business_unit !== 'KFC Office' &&
        unit.business_unit !== 'KFC Wörgl' &&
        unit.business_unit !== 'KFC Lugner City' &&
        unit.business_unit !== 'KFC Novum Prešov'
    );

    

    //get terminated employees
     const termEmpInfo = await getTerminatedEmployees(start, end);
     const termEmpIds = termEmpInfo.map(emp => emp.employee_id);
     //console.log('terminated Ids', termEmpInfo)
    //only called if ther are term emoIds
     let employeeData = [];
        if (termEmpIds.length > 0) {
            employeeData = await getEmployeeData(termEmpIds);
        }

    // console.log(employeeData);

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

    // console.log(terminated)


    
    
    //gets All hired employees to the current date
    const employees = await getMapalEmployees();
    const allEmployees = [...terminated,...employees];
    const onlyTPPandTPPM = allEmployees.filter(emp => emp.job !== 'Student' && emp.job !== 'Part Timer');
    //const filt = employees.filter(emp => emp.unit_id === 13);
    //console.log('Employees:', onlyTPP);


    const unitDataPromises = filteredUnits.map( async unit => {

        const filteredEmployees = onlyTPPandTPPM.filter(emp => emp.unit_id === unit.business_unit_id);
        const employeeIds = filteredEmployees.map(emp => emp.employee_id);
       // console.log('Employee IDs current:', employeeIds.length);
        //const employeeIds = [...employeeIdsCurr,...termEmpIds];
        
        const empAbsences = await getAbsences(employeeIds, start, end);
        //console.log('Absences:', empAbsences.length);
        const empState = await getEmployeeLabourState(employeeIds);
       // console.log('State:', empState);
       //need to loop through the employeeIds and get the hours one by one from getWorkedHours
        const workedHours = [];
            for (const empId of employeeIds) {
                const hours = await getWorkedHours(start, end, empId);
                // If getWorkedHours returns an array, use spread; if object, just push
                if (Array.isArray(hours)) {
                    workedHours.push(...hours);
                } else if (hours) {
                    workedHours.push(hours);
                }
            }

        //const workedHours = await getWorkedHours(start, end, unit.business_unit_id);
       // console.log('Worked Hours:', workedHours);
        const hoursFond = await getHoursFondCompliance(start, end, employeeIds);
        // console.log('Hours Fond:', hoursFond.length);

        
            
/*
                console.log(
                    'Unit:', unit.business_unit,
                    'Employee IDs:', employeeIds.length,
                    'Absences:', empAbsences.length,
                    'State:', empState.length,
                    'Worked Hours:', workedHours.length,
                    'Hours Fond:', hoursFond.length
                );
*/

        const unitEmployeesData = filteredEmployees.map(emp => {

            const filteredWorkedHours = workedHours.filter(hours => hours.id_employee === emp.employee_id);
           
            const filteredHoursFond = hoursFond.filter(fond => fond.employee_id === emp.employee_id);



            return {
                employeeId: emp.employee_id,
                unitId: emp.unit_id,
                employee: `${emp.name} ${emp.last_name}`,
                absences: empAbsences.filter(abs => abs.employee_id === emp.employee_id),
                state: empState.filter(state => state && state.employee_id === emp.employee_id),
                workedHours: filteredWorkedHours.length ? filteredWorkedHours : [ { total_time: 0 } ],
                hoursFond: filteredHoursFond.length ? filteredHoursFond : [ { result: 0 } ]
            }
        });
               

        const employeeData = await Promise.all(unitEmployeesData);

        const mng = employeeData.filter(e => e.state[0].contract === 'TPPM');
        const emps = employeeData.filter(e => e.state[0].contract !== 'TPPM');

       // console.log(emps);

        const overtimeSum = emps.reduce((sum, emp) =>{
            const overtime = (emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2);
            if (overtime > 0){
                return sum + (Number(overtime) || 0);
            }
            return sum;
        }, 0);

        const minusHoursSum = emps.reduce((sum, emp) =>{
            const overtime = (emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2);
            if (overtime < 0){
                return sum + (Number(overtime) || 0);
            }
            return sum;
        }, 0);
        
        const overtimeSumMng = mng.reduce((sum, emp) =>{
            const overtime = (emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2);
            if (overtime > 0){
                return sum + (Number(overtime) || 0);
            }
            return sum;
        }, 0);

        const minusHoursSumMng = mng.reduce((sum, emp) =>{
            const overtime = (emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2);
            if (overtime < 0){
                return sum + (Number(overtime) || 0);
            }
            return sum;
        }, 0);




       // console.log('Unit', unit.business_unit, 'OvertimeTotal', overtimeSum, 'MinusHoursSum', minusHoursSum);

        return {
                unitId: unit.business_unit_id,
                unitName: unit.business_unit,
                employees: employeeData,
                overtimeSum: overtimeSum,
                minusHoursSum: minusHoursSum,
                overtimeSumMng: overtimeSumMng,
                minusHoursSumMng: minusHoursSumMng
        };


    });
   
   const unitData  = await Promise.all(unitDataPromises);

   //console.log('Employee Data:', unitData);
    /*
   unitData[1].employees.forEach(element => {

        console.log('Employee:', element.employee, 
                    'Absences:', element.absences.length, 
                    'State:', element.state[0].contract, 
                    'Worked Hours:', element.workedHours[0].total_time,
                    'Hours Fond:', element.hoursFond[0].result,
                    'Overtime:', (element.workedHours[0].total_time - element.hoursFond[0].result).toFixed(2),
                    'TPPM Worked Hours YTM:', element.TPPMworkedHoursYTM[0].total_time,
                    'TPPM Hours Fond YTM:', element.TPPMhoursFondYTM[0].result,
            )}
    );
    */

    return unitData
}

module.exports = {
    labourCompliance
};

