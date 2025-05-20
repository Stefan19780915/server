const moment = require("moment");


function makeUnitShiftEmail (unitShifts, headCount){     

   // console.log('Unit Shifts:', unitShifts.filter(shift => shift.unitName = 'KFC Aupark Bratislava')[0]);
   const filteredUnits = unitShifts.filter(unit =>
        unit.unitName !== 'KFC Office' &&
        unit.unitName !== 'KFC Wörgl'
    );

    // Sort units alphabetically by unitName
   filteredUnits.sort((a, b) => a.unitName.localeCompare(b.unitName));

    const unitShiftList = filteredUnits.map( (unitShift)=>{
        const TPP = headCount.find(unit => unit.unitName === unitShift.unitName).TPP;
        const DOBPS = headCount.find(unit => unit.unitName === unitShift.unitName).DOBPS;
        const DOPC = headCount.find(unit => unit.unitName === unitShift.unitName).DOPC;
        const SL = headCount.find(unit => unit.unitName === unitShift.unitName).SL;
        const ARGM = headCount.find(unit => unit.unitName === unitShift.unitName).ARGM;
        const RGM = headCount.find(unit => unit.unitName === unitShift.unitName).RGM;
        const hc = headCount.find(unit => unit.unitName === unitShift.unitName).headCount;
        
       // console.log('TPP:', TPP, 'Unit:', unitShift.unitName);


        return `<table style="width:75%; border-collapse: collapse; border: 1px solid black;">
            <tr>
                <th style="width:12.5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">${unitShift.unitName}</th>
                <th style="width:12.5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">TPP</th>
                <th style="width:12.5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">DOBPS</th>
                <th style="width:12.5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">DOPC</th>
                <th style="width:12.5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">SL</th>
                <th style="width:12.5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">ARGM</th>
                <th style="width:12.5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">RGM</th>
                <th style="width:12.5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">Spolu</th>
                
                
                
            </tr>
            <tr>
                <td style="padding: 8px">Počet</td>
                <td style="padding: 8px; text-align: center">${TPP}</td>
                <td style="padding: 8px; text-align: center">${DOBPS}</td>
                <td style="padding: 8px; text-align: center">${DOPC}</td>
                <td style="padding: 8px; text-align: center">${SL}</td>
                <td style="padding: 8px; text-align: center">${ARGM}</td>
                <td style="padding: 8px; text-align: center">${RGM}</td>
                <td style="padding: 8px; text-align: center">${hc}</td>
            </tr>
            <tr>
                <th style="padding: 8px" colspan="7">Aktuálný týždeň - Naplánované hodiny</th>
                <th style="padding: 8px">Spolu</th>
            </tr>
            <tr>
                
                ${unitShift.currentWeekShifts.map( (shift) => {
                    return `<td style="padding: 8px; text-align: center; background-color:${bcWeekendColor(shift.date)}; color:${fontWeekendColor(shift.date)}">${shift.date}</td>`
                }   
                ).join('')}
                
            </tr>
            <tr>
                ${unitShift.currentWeekShifts.map( (shift) => {
                    return `<td style="padding: 8px; text-align: center; font-weight: bold">${shift.totalHours}</td>`
                }   
                ).join('')}
            </tr>
          </table>
          <br>
          <br>
          <br>
          <br>`
    })


    return html = `
      <h2>Good morning,</h2>
      <p>Please find below all units with their shifts and total hours planned / worked.</p>

        ${unitShiftList.join('')}

      `;
  }

  function bcWeekendColor (day) {
    const safeDay = day.replace(/\//g, '-');
    const dayOfWeek = moment(safeDay, "YYYY-MM-DD").day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return '#C41230'; // Light RED for weekends
    } else {
      return '#FFFFFF'; // White for weekdays
    }
  }

  function fontWeekendColor (day) {
    const safeDay = day.replace(/\//g, '-');
    const dayOfWeek = moment(safeDay, "YYYY-MM-DD").day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return '#FFFFFF'; // White for weekends
    } else {
      return 'rgb(0, 0, 0)'; // Black for weekdays
    }
  }

 

  module.exports = {
    makeUnitShiftEmail
  }