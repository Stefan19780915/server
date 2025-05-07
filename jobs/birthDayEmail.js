
const { apiTokenAutomate } = require('../middleware/apiToken');
const { getMapalEmployees } = require('../api/Mapal');
const moment = require("moment");
const { getDate } = require('date-fns');
const sendEmail = require("../utils/sendEmployeeEmail");
const {makeBirthDayEmail} = require("../utils/birthDayEmail")
const {makeBirthDayEmailin7Days} = require("../utils/birthDayEmailin7days")
const {getUnits} = require("../api/Mapal");
const {getMapalUsers} = require("../api/Mapal");

let today = moment();
let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
let seveDays = moment(today).add(7, 'days');


    
const job1 = async ()=>{
    await apiTokenAutomate();
    const employees = await getMapalEmployees();
    const units = await getUnits();

    const areaCoach = await getMapalUsers();

    const ac = areaCoach.find(usr => {
      return usr.user_id == '10a01dc0-ccb2-4055-9f39-eded7004861f';
    });
    
    try {
      units.forEach( async (unit)=>{

       // console.log(unit)

        const empWhoHasBDTomorrow = empBDTomorrow(employees).filter(e => e.unit == unit.business_unit);
     // console.log(empWhoHasBDTomorrow);
        const empWhoHasBDIn7Days = upCommingBirthdays(employees).filter(e => e.unit == unit.business_unit);
       // console.log(empWhoHasBDIn7Days)


        if (empWhoHasBDTomorrow.length){
            const html = makeBirthDayEmail(empWhoHasBDTomorrow, empWhoHasBDIn7Days);
            const subject = 'KFC Employees who will have birthday tomorrow and in the next 7 days.'
               
           // console.log(unit.email)
           const email = 'stefan.csomor@qweurope.com';
            const info = await sendEmail(
              unit.email,
                [email, ac.email],
                subject,
                html
              );
  

              if (info.messageId) {
                console.log("Message sent");
              } else {
                console.log("Message was not sent");
              }
        } 

      });

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







