
const { apiTokenAutomate } = require('../middleware/apiToken');
const { getMapalEmployees } = require('../api/Mapal');
const moment = require("moment");
const { getDate } = require('date-fns');
const sendEmail = require("../utils/sendEmployeeEmail");
const {makeBirthDayEmail} = require("../utils/birthDayEmail")
const {makeBirthDayEmailin7Days} = require("../utils/birthDayEmailin7days")

let today = moment();
let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
let seveDays = moment(today).add(7, 'days');
    
const job1 = async ()=>{
    await apiTokenAutomate();
    const employees = await getMapalEmployees();
    
    
    try {
        const empWhoHasBDTomorrow = empBDTomorrow(employees);
        const empWhoHasBDIn7Days = upCommingBirthdays(employees);

        if (empWhoHasBDTomorrow.length){
            const html = makeBirthDayEmail(empWhoHasBDTomorrow, empWhoHasBDIn7Days);
            const subject = 'KFC Employees who will have birthday tomorrow.'
                     
            const info = await sendEmail(
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
              
        } else {
            const empWhoHasBDIn7Days = upCommingBirthdays(employees);

            if(empWhoHasBDIn7Days.length){
                const html = makeBirthDayEmailin7Days(empWhoHasBDIn7Days);
                const subject = 'KFC Employees who will have birthday in the next 7 days.'

                
            const info = await sendEmail(
                'stefan.csomor@qweurope.com',
                ['stefan_csomor@hotmail.com', 'eur@qweurope.com'],
                subject,
                html
              );

              if (info.messageId) {
                console.log("Message sent");
              } else {
                console.log("Message was not sent");
              } 
                
            } 


        }

    } catch (err) {
        console.log(err);
    }
}


const empBDTomorrow = (employees)=>{
    const result = employees.filter( (emp)=>{
       return new Date(emp.birth_date).getDate() == new Date(tomorrow).getDate() && new Date(emp.birth_date).getMonth() == new Date(tomorrow).getMonth();
        ///console.log(emp.last_name);
    });
    return result;
}

const upCommingBirthdays = (employees)=>{
    //console.log ( today, seveDays ,today.year());
    const result = employees.filter( (emp)=>{
        const empBD = moment(emp.birth_date).set({'year': today.year()});
        return empBD > today && empBD < seveDays; 
    })
    return result;
}


job1();





