const moment = require("moment");


function makeUnitShiftEmail (unitShifts, headCount){     

   // console.log('Unit Shifts:', unitShifts.filter(shift => shift.unitName = 'KFC Aupark Bratislava')[0]);
   const filteredUnits = unitShifts.filter(unit =>
        unit.unitName !== 'KFC Office' &&
        unit.unitName !== 'KFC Wörgl'
    );

    // Sort units alphabetically by unitName
   filteredUnits.sort((a, b) => a.unitName.localeCompare(b.unitName));
   //console.log('Filtered Units:', filteredUnits);
   //console.log('Unit Shifts:', filteredUnits.filter(shift => shift.unitName = 'KFC Aupark Bratislava')[0]);

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
                <th style="width:12.5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)"></th>
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
                <td style="padding: 8px; text-align: center"></td>
                <td style="padding: 8px; text-align: center">${hc}</td>
            </tr>
            <tr>
                <th style="padding: 8px" colspan="9">Aktuálný týždeň - Naplánované hodiny / Odpracované Hodiny</th>
                
            </tr>
            <tr>
                <td style="padding: 8px">Dátum</td>
                ${unitShift.currentWeekShifts.map( (shift) => {
                    return `<td style="padding: 8px; text-align: center; background-color:${bcWeekendColor(shift.date)}; color:${fontWeekendColor(shift.date)}">${shift.date}</td>`
                }   
                ).join('')}
                
            </tr>
            <tr>
                <td style="padding: 8px">Plán</td>
                ${unitShift.currentWeekShifts.map( (shift) => {
                  const hours = Number(shift.totalHours) || 0;
                    return `<td style="padding: 8px; text-align: center; font-weight: bold; background-color:${bcToDayColor(shift.date)}">${hours.toFixed(1)}</td>`
                }   
                ).join('')}
                <td style="padding: 8px; text-align: center; font-weight: bold; background-color:#C41230; color:rgb(255, 255, 255)">${unitShift.totalHoursSum.toFixed(1)}</td>
            </tr>
            <tr>
                <td style="padding: 8px">Odpracované</td>
                ${unitShift.currentWeekShifts.map( (shift) => {
                  const hours = Number(shift.totalClockings) || 0;
                    return `<td style="padding: 8px; text-align: center; font-weight: bold; background-color:${bcToDayColor(shift.date)}">${hours.toFixed(1)}</td>`
                }   
                ).join('')}
                <td style="padding: 8px; text-align: center; font-weight: bold; background-color:#C41230; color:rgb(255, 255, 255)">${unitShift.totalClockingsSum.toFixed(1)}</td>
            </tr>
            <tr>
                <td style="padding: 8px">Tržba</td>
                ${unitShift.currentWeekShifts.map( (shift) => {
                  const sales = Number(shift.totalSales) || 0;
                    return `<td style="padding: 8px; text-align: center; font-weight: bold; background-color:${bcToDayColor(shift.date)}">€${sales.toFixed()}</td>`
                }   
                ).join('')}
                <td style="padding: 8px; text-align: center; font-weight: bold; background-color:#C41230; color:rgb(255, 255, 255)"></td>
            </tr>
            <tr>
                <td style="padding: 8px">Zákazníci</td>
                ${unitShift.currentWeekShifts.map( (shift) => {
                  const checks = Number(shift.totalChecks) || 0;
                    return `<td style="padding: 8px; text-align: center; font-weight: bold; background-color:${bcToDayColor(shift.date)}">${checks.toFixed()}</td>`
                }   
                ).join('')}
                <td style="padding: 8px; text-align: center; font-weight: bold; background-color:#C41230; color:rgb(255, 255, 255)"></td>
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

  function bcToDayColor (day) {
    const toDayObj = new Date();
    const toDay = `${toDayObj.getFullYear()}-${toDayObj.getMonth() + 1}-${toDayObj.getDate()}`;
   // console.log('toDay:', toDay);
    const safeDay = day.replace(/\//g, '-');
  //  console.log('safeDay:', safeDay);
    if (safeDay === toDay) {
      return '#D3D3D3'; // Light gray for today
    } else {
      return '#FFFFFF'; // other days white
    }
  }
 

  module.exports = {
    makeUnitShiftEmail
  }