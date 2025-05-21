const { apiTokenAutomate } = require('../middleware/apiToken');
const { getUnits } = require('../api/Mapal');
const { getShifts } = require('../api/Mapal');
const { unitHeadCount } = require('../api/unitHeadCount');
const sendEmail = require("../utils/sendEmployeeEmail");
const { makeUnitShiftEmail } = require('../utils/unitShiftEmail');
const moment = require("moment");



const unitShiftHoursJob = async () => {
    await apiTokenAutomate();
   
    // Get the current date
    const currentDate = new Date();
    const weekStart = moment(getStartOfWeek(currentDate)).format('YYYY/MM/DD');
    const weekEnd = moment(getEndOfWeek(currentDate)).format('YYYY/MM/DD');
    // const shifts = await getShifts(toDayFrom, toDayTo, '13'); 
    const units = await getUnits();
    //getting headCount for each unit//
    const employeeHeadCount = await unitHeadCount();
   // console.log('Employees:', employeeHeadCount);

   try {
   
    //const filterUnits = units.filter(unit => unit.business_unit_id === 13);
    //console.log('Units:', units.filter(unit => unit.business_unit_id === 13));


    //Loop throuth the units and get the shifts for each unit//
     const unitShiftsPromises = units.map(async (unit) => {
         const unitId = unit.business_unit_id;
         if (unitId === undefined) return null; // Skip if unitId is undefined
         const unitName = unit.business_unit;

        const weeks = getWeekDates();
        //console.log('Current Week:', weeks.currentWeek);

        const currentWeekShiftsPromisses = weeks.currentWeek.map( async (date)=>{

            // If date is in 'YYYY/MM/DD' format:
            const [year, month, day] = date.split('/').map(Number);
            const nextDay = new Date(year, month - 1, day+1); // month is zero-based
            //console.log('Next Day:', nextDay.toDateString(), date);
          
            const shifts = await getShifts(date, nextDay.toDateString());
            console.log('Shifts:', shifts);

            //Looping through the shifts and reducing to sum of hours//
        const totalHours = shifts.reduce((acc, shift) => {
            if (shift.business_unit_id !== unitId) return acc; // Skip if shift business unit id does not match unit id
            // Calculate the time difference in hours
            let hoursWorked = calculateTimeDifference(moment(shift.entry).format('LT'), moment(shift.exit).format('LT')) < 6.5 
            ?  calculateTimeDifference(moment(shift.entry).format('LT'), moment(shift.exit).format('LT'))
            : calculateTimeDifference(moment(shift.entry).format('LT'), moment(shift.exit).format('LT'))-0.5;
            //console.log('Hours Worked:', hoursWorked, 'From:',moment(shift.entry).format('LT') , 'To:',moment(shift.exit).format('LT'));

            return acc + hoursWorked;
            },0)
            
        
          return {
            unit: unitName,
            date: date,
            shifts: shifts,
            totalHours: totalHours,         
          };
        }) 

        const currentWeekShifts = await Promise.all(currentWeekShiftsPromisses);

        // Wait for all promises to resolve
        //const currentShifts = await Promise.all(currentWeekShifts);
       // console.log('Current Shifts:', currentShifts.filter(shift => shift.unitName = 'KFC Aupark Bratislava'));	
        

         return {
             unitId: unitId,
             unitName: unitName,
             currentWeekShifts: currentWeekShifts,
  
         };
     });

     // Wait for all promises to resolve and filter out nulls
    const unitShifts = (await Promise.all(unitShiftsPromises)).filter(Boolean);
   
   // console.log(makeUnitShiftEmail(unitShifts))

    //SEND EMAIL//
    
    if (unitShifts.length) {
            const html = makeUnitShiftEmail(unitShifts, employeeHeadCount);
            const subject = `KFC Units - Planned / Worked Hours - ${weekStart} - ${weekEnd}`;
               
           // console.log(unit.email)
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
        } 
     

    return unitShifts;   
   // console.log('Area Coach Job executed successfully:', units);
  } catch (error) {
   // console.error('Error executing Area Coach Job:', error);
  }
}




// Helper Function to calculate time difference
// This function calculates the difference in hours between two time strings in 'HH:mm' format

function calculateTimeDifference  (time1, time2)  {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

   // console.log(hours1, minutes1, hours2, minutes2);

    const date1 = new Date(0, 0, 0, hours1, minutes1);
    const date2 = new Date(0, 0, 0, hours2, minutes2);

    const diffInMilliseconds = Math.abs(date2 - date1);
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    return diffInHours;
};


// Helper function to get week dates
function getWeekDates(referenceDate = new Date()) {
    // Ensure referenceDate is a Date object
    const date = new Date(referenceDate);
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();
    // Calculate the start of the current week (Monday)
    const mondayOffset = (dayOfWeek + 6) % 7; // 0 (Mon) ... 6 (Sun)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - mondayOffset);

    // Helper to format date as YYYY/MM/DD
    const format = d => 
        `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;

    // Get dates for a week starting from a given date
    const getWeek = (start) => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return format(d);
        });
    };

    // Current week
    const currentWeek = getWeek(startOfWeek);

    // Previous week
    const prevWeekStart = new Date(startOfWeek);
    prevWeekStart.setDate(startOfWeek.getDate() - 7);
    const previousWeek = getWeek(prevWeekStart);

    // Next week
    const nextWeekStart = new Date(startOfWeek);
    nextWeekStart.setDate(startOfWeek.getDate() + 7);
    const nextWeek = getWeek(nextWeekStart);

    return {
        previousWeek,
        currentWeek,
        nextWeek
    };
}
// Example usage:
//const weeks = getWeekDates();
//console.log('Previous Week:', weeks.previousWeek);
//console.log('Current Week:', weeks.currentWeek);
//console.log('Next Week:', weeks.nextWeek);


function getStartOfWeek(date) {
    const dayOfWeek = date.getDay();
    //console.log('Day of Week:', dayOfWeek);
    const mondayOffset = (dayOfWeek + 6) % 7; // 0 (Mon) ... 6 (Sun)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - mondayOffset);
    return startOfWeek;
}

function getEndOfWeek(date) {
    const dayOfWeek = date.getDay();
   // console.log('Day of Week:', dayOfWeek);
    const sundayOffset = (dayOfWeek + 3) % 7; // 0 (Mon) ... 6 (Sun)
    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + sundayOffset);
   // console.log('End of Week:', endOfWeek);
    return endOfWeek;
}


//call the function
unitShiftHoursJob();

//not to export this function
/*
module.exports = {
    unitShiftHoursJob
};
*/


