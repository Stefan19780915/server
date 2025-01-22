const { apiTokenAutomate } = require('../middleware/apiToken');
const { getMapalEmployees } = require('../api/Mapal');
const sendEmail = require("../utils/sendEmployeeEmail");
const {makeSeniorityEmail} = require("../utils/seniorityEmail");


let now = new Date();
let lastYear = new Date().setFullYear(new Date().getFullYear() -1);
let threeYears = new Date().setFullYear(new Date().getFullYear() -3);
let fiveYears = new Date().setFullYear(new Date().getFullYear() -5);
let tenYears = new Date().setFullYear(new Date().getFullYear() -10);
let fifteenYears = new Date().setFullYear(new Date().getFullYear() -15);
let twentyYears = new Date().setFullYear(new Date().getFullYear() -20);
let twentyfiveYears = new Date().setFullYear(new Date().getFullYear() -25);

const job1 = async ()=>{
    await apiTokenAutomate();
    const employees = await getMapalEmployees();

    function monthlyList (month){
        const emp1 = listOfEmployees(employees, lastYear, month);
    const emp3 = listOfEmployees(employees, threeYears, month);
    const emp5 = listOfEmployees(employees, fiveYears, month);
    const emp10 = listOfEmployees(employees, tenYears, month);
    const emp15 = listOfEmployees(employees, fifteenYears, month);
    const emp20 = listOfEmployees(employees, twentyYears, month);
    const emp25 = listOfEmployees(employees, twentyfiveYears, month);

    return {emp1, emp3, emp5, emp10, emp15, emp20, emp25}

    }

    const curentMonth = monthlyList(0);
    const curentMonth1 = monthlyList(1);
    const curentMonth2 = monthlyList(2);
    const curentMonth3 = monthlyList(3);
    const curentMonth4 = monthlyList(4);
    const curentMonth5 = monthlyList(5);
    const curentMonth6 = monthlyList(6);
    const curentMonth7 = monthlyList(7);
    const curentMonth8 = monthlyList(8);
    const curentMonth9 = monthlyList(9);
    const curentMonth10 = monthlyList(10);
    const curentMonth11 = monthlyList(11);
/*
    console.log(
        curentMonth8.emp10.forEach(element => {
            console.log(element.last_name,element.unit,moment(new Date(element.hired_date)).format('LL'), `in ${moment(new Date(element.hired_date)).format('MMMM')} will celebrate 10 years with the company`)
           }),
           curentMonth8.emp1.forEach(element => {
            console.log(element.last_name,element.unit,moment(new Date(element.hired_date)).format('LL'), `in ${moment(new Date(element.hired_date)).format('MMMM')} will celebrate 1 year with the company`)
           }),
    )

console.log(
    makeSeniorityEmail(
        curentMonth,
        curentMonth1,
        curentMonth2,
        curentMonth3,
        curentMonth4,
        curentMonth5,
        curentMonth6,
        curentMonth7,
        curentMonth8,
        curentMonth9,
        curentMonth10,
        curentMonth11,
    )
)
    */
   try {
        if(curentMonth){
            const html = makeSeniorityEmail(
                curentMonth,
                curentMonth1,
                curentMonth2,
                curentMonth3,
                curentMonth4,
                curentMonth5,
                curentMonth6,
                curentMonth7,
                curentMonth8,
                curentMonth9,
                curentMonth10,
                curentMonth11,
            );
            const subject = 'KFC Employees who will celebrate their anniversary.'
               
           // console.log(html)
            
            const info = await sendEmail(
                'stefan.csomor@qweurope.com',
                ['stefan_csomor@hotmail.com'],
                subject,
                html
              );

              if (info.messageId) {
                console.log("Message sent");
              } else {
                console.log("Message was not sent");
              }
        }

   } catch (err) {
    console.log(err);
   }


}

 

const listOfEmployees = (employees, time, month)=>{
    const result = employees.filter( e =>{
        return new Date(e.hired_date).getMonth() == now.getMonth() + month && new Date(e.hired_date).getFullYear() == new Date(time).getFullYear();
    } )
return result;
}


job1();

