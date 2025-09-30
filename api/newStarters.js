const { apiTokenAutomate } = require('../middleware/apiToken');
const { getEmployeeLabourState } = require('../api/Mapal');
const { getHiredEMployeesByDateRange } = require('../api/Mapal');
const moment = require("moment");
const { getEmployeeData } = require('../api/Mapal');
const { getWorkedHours } = require('../api/Mapal');
const { makeNewStartersEmail } = require('../utils/newStartersEmail');
const sendEmail = require("../utils/sendEmployeeEmail");
const sendEmailOffice = require("../utils/sendEmployeeEmailOffice");

const newStarters = async () => {
    await apiTokenAutomate();
    const currentDate = new Date();
    const toDayFrom = moment(currentDate).startOf('month').format('YYYY-MM-DD');
    const toDayFromObj = new Date(moment(currentDate).startOf('month'));
    // get the next month
    const toDayTo = moment(currentDate).add(1, 'months').endOf('month').format('YYYY-MM-DD');
    const toDayToObj = new Date(moment(currentDate).add(1, 'months').endOf('month'));
    
    const employees = await getHiredEMployeesByDateRange(toDayFrom, toDayTo);

    const filteredEmployees = employees.filter(emp =>
        emp.workcenter !== 'KFC Wörgl' &&
        emp.workcenter !== 'KFC Lugner City'
    );

    // sort by hire date descending
    filteredEmployees.sort((a, b) => new Date(b.hire_date) - new Date(a.hire_date));
    const empIds = filteredEmployees.map(emp => emp.employee_id);

    const employeesDetails = await getEmployeeData(empIds);

    //console.log('New Starters this month:', filteredEmployees);

    const workedHours = [];
            for (const empId of empIds) {
               // console.log(`Fetching worked hours for employee ID: ${empId}`);
                const hours = await getWorkedHours(toDayFromObj, toDayToObj, empId);
                // If getWorkedHours returns an array, use spread; if object, just push
                if (Array.isArray(hours)) {
                    workedHours.push(...hours);
                } else if (hours) {
                    workedHours.push(hours);
                }
            }

    

  //  console.log('Worked hours for employee ID', workedHours);

    const employeesWithDetailsPromises = filteredEmployees.map(emp => {
        const details = employeesDetails.find(detail => detail.employee_id === emp.employee_id) || {};
        const hours = workedHours.filter(wh => wh.id_employee === emp.employee_id);
       // console.log('Worked hours for employee ID', hours);
        return {
            ...emp,
            ...details,
            workedHours: hours.length ? hours : [{ total_time: 0 }] // Default to 0 if no hours found
        };
    });

   // console.log('New Starters with details:', employeesWithDetails);
   /*
    employeesWithDetailsPromises.forEach(emp => {
        console.log(`Name: ${emp.name} ${emp.last_name}, Hire Date: ${emp.hire_date}, salary: ${emp.salary} Exp END: ${emp.expected_termination_date}, RC: ${emp.social_security_number}, Contract: ${emp.contract}, Category: ${emp.category}, Total Worked Hours This Month: ${emp.workedHours[0].total_time.toFixed(2)}`);
    });

    */

    const employeesWithDetails = await Promise.all(employeesWithDetailsPromises);
    
    try {

        if (employeesWithDetails.length) {
            const html = makeNewStartersEmail(employeesWithDetails);
            const subject = `KFC NEW STARTERS for ${moment(currentDate).format('MMMM YYYY')}`;
               
           // console.log(unit.email)
           
            const info = await sendEmailOffice(
              'stefan.csomor@qweurope.com',
                [],
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
        console.error('Error sending New Starters email:', error);
    }

}


module.exports = { newStarters };