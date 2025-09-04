const moment = require("moment");


function makeStoreShiftEmail (unitShifts, headCount, compliance, monthStart, unitId){     

   // console.log('Unit Shifts:', unitShifts.filter(shift => shift.unitName = 'KFC Aupark Bratislava')[0]);
   const filteredUnits = unitShifts.filter(unit =>
        unit.unitId == unitId
    );

   // console.log(headCount);

    // Sort units alphabetically by unitName
   filteredUnits.sort((a, b) => a.unitName.localeCompare(b.unitName));
   //console.log('Filtered Units:', filteredUnits);
   //console.log('Unit Shifts:', filteredUnits.filter(shift => shift.unitName = 'KFC Aupark Bratislava')[0]);

   const sortedCompliance = compliance.sort((a, b)=> a.unitName.localeCompare(b.unitName));

  const complianceOvertimeSum = sortedCompliance.reduce((sum, c) => sum + (Number(c.overtimeSum) || 0), 0);
  const complianceMinusHoursSum = sortedCompliance.reduce((sum, c) => sum + (Number(c.minusHoursSum) || 0), 0);

  const complianceSummary = sortedCompliance.map(c =>{
              return `
                <tr>
                  <td style="padding: 8px; text-align: left">${c.unitName}</td>
                  <td style="padding: 8px; text-align: center">${c.overtimeSum}</td>
                  <td style="padding: 8px; text-align: center">${c.minusHoursSum}</td>
                </tr>
              `;

            }).join('');

    const unitShiftList = filteredUnits.map( (unitShift)=>{
        const TPP = headCount.find(unit => unit.unitName === unitShift.unitName).TPP;
        const DOBPS = headCount.find(unit => unit.unitName === unitShift.unitName).DOBPS;
        const DOPC = headCount.find(unit => unit.unitName === unitShift.unitName).DOPC;
        const SL = headCount.find(unit => unit.unitName === unitShift.unitName).SL;
        const ARGM = headCount.find(unit => unit.unitName === unitShift.unitName).ARGM;
        const RGM = headCount.find(unit => unit.unitName === unitShift.unitName).RGM;
        const hc = headCount.find(unit => unit.unitName === unitShift.unitName).headCount;

        

            

            const currentCompliance = compliance.find(c => c.unitId === unitShift.unitId);

            const currentComplianceMng = currentCompliance.employees.filter(e =>{
              const mng = e.state[0].contract == 'TPPM';
              return mng;
            })

            const currentComplianceEmp = currentCompliance.employees.filter(e =>{
              const emp = e.state[0].contract !== 'TPPM';
              return emp;
            })
      

           // console.log(currentCompliance, unitShift.unitId)

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

            <!-- NEXT WEEK -->
            
           


            <!-- CURRENT WEEK -->
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
                <td style="padding: 8px; text-align: center; font-weight: bold; background-color:#C41230; color:rgb(255, 255, 255)">€${unitShift.totalSalesSum.toFixed(1)}</td>
            </tr>
            <tr>
                <td style="padding: 8px">Zákazníci</td>
                ${unitShift.currentWeekShifts.map( (shift) => {
                  const checks = Number(shift.totalChecks) || 0;
                    return `<td style="padding: 8px; text-align: center; font-weight: bold; background-color:${bcToDayColor(shift.date)}">${checks.toFixed()}</td>`
                }   
                ).join('')}
                <td style="padding: 8px; text-align: center; font-weight: bold; background-color:#C41230; color:rgb(255, 255, 255)">${unitShift.totalChecksSum.toFixed(1)}</td>
            </tr>


            <!-- PREVIOUS WEEK -->
            <tr>
                <th style="padding: 8px" colspan="9">Minulý týždeň - Naplánované hodiny / Odpracované Hodiny</th>
                
            </tr>
            <tr>
                <td style="padding: 8px">Dátum</td>
                ${unitShift.previousWeekShifts.map( (shift) => {
                    return `<td style="padding: 8px; text-align: center; background-color:${bcWeekendColor(shift.date)}; color:${fontWeekendColor(shift.date)}">${shift.date}</td>`
                }   
                ).join('')}
                
            </tr>
            <tr>
                <td style="padding: 8px">Plán</td>
                ${unitShift.previousWeekShifts.map( (shift) => {
                  const hours = Number(shift.totalHours) || 0;
                    return `<td style="padding: 8px; text-align: center; font-weight: bold; background-color:${bcToDayColor(shift.date)}">${hours.toFixed(1)}</td>`
                }   
                ).join('')}
                <td style="padding: 8px; text-align: center; font-weight: bold; background-color:#C41230; color:rgb(255, 255, 255)">${unitShift.totalHoursSumPrev.toFixed(1)}</td>
            </tr>
            <tr>
                <td style="padding: 8px">Odpracované</td>
                ${unitShift.previousWeekShifts.map( (shift) => {
                  const hours = Number(shift.totalClockings) || 0;
                    return `<td style="padding: 8px; text-align: center; font-weight: bold; background-color:${bcToDayColor(shift.date)}">${hours.toFixed(1)}</td>`
                }   
                ).join('')}
                <td style="padding: 8px; text-align: center; font-weight: bold; background-color:#C41230; color:rgb(255, 255, 255)">${unitShift.totalClockingsSumPrev.toFixed(1)}</td>
            </tr>
            <tr>
                <td style="padding: 8px">Tržba</td>
                ${unitShift.previousWeekShifts.map( (shift) => {
                  const sales = Number(shift.totalSales) || 0;
                    return `<td style="padding: 8px; text-align: center; font-weight: bold; background-color:${bcToDayColor(shift.date)}">€${sales.toFixed()}</td>`
                }   
                ).join('')}
                <td style="padding: 8px; text-align: center; font-weight: bold; background-color:#C41230; color:rgb(255, 255, 255)">€${unitShift.totalSalesSumPrev.toFixed(1)}</td>
            </tr>
            <tr>
                <td style="padding: 8px">Zákazníci</td>
                ${unitShift.previousWeekShifts.map( (shift) => {
                  const checks = Number(shift.totalChecks) || 0;
                    return `<td style="padding: 8px; text-align: center; font-weight: bold; background-color:${bcToDayColor(shift.date)}">${checks.toFixed()}</td>`
                }   
                ).join('')}
                <td style="padding: 8px; text-align: center; font-weight: bold; background-color:#C41230; color:rgb(255, 255, 255)">${unitShift.totalChecksSumPrev.toFixed(1)}</td>
            </tr>

            <!-- COPLIANCE -->
            <tr>
                <th style="padding: 8px" colspan="3">${unitShift.unitName}</th>
                <th style="padding: 8px" colspan="6">Compliance ----- From: ${monthStart} ----- To: ${unitShift.currentWeekShifts[6].date}</th>
            </tr>
            <tr>
                  <td style="padding: 8px; text-align: center" >Zamestnanec</td>
                  <td style="padding: 8px; text-align: center" >Nástup</td>
                  <td style="padding: 8px; text-align: center" >Ukončenie</td>
                  <td style="padding: 8px; text-align: center">D, P, PN, OCR</td>
                  <td style="padding: 8px; text-align: center">Uväzok</td>
                  <td style="padding: 8px; text-align: center">Odpracované hodiny</td>
                  <td style="padding: 8px; text-align: center">Pracovný Fond</td>
                  <td style="padding: 8px; text-align: center">Nadčas</td>
                  <td style="padding: 8px; text-align: center">Chýbajúce hodiny</td>    
            </tr>
            ${currentComplianceEmp.map(emp =>{
              return  `
                <tr>
                  <td style="padding: 8px; text-align: center">${emp.employee}</td>
                 <td style="padding: 8px; text-align: center">${ new Date(emp.state[0].start_date) > new Date(monthStart) ? moment(emp.state[0].start_date).format('L') : ''}</td>
                  <td style="padding: 8px; text-align: center">${emp.termination_date ? moment(emp.termination_date).format('L') : ''}</td>
                  <td style="padding: 8px; text-align: center">${emp.absences.length}</td>
                  <td style="padding: 8px; text-align: center">${emp.state[0].contract}</td>
                  <td style="padding: 8px; text-align: center">${emp.workedHours[0].total_time.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: center">${emp.hoursFond[0].result.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: center">${(emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2) > 0 ? (emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2) : ''}</td>
                  <td style="padding: 8px; text-align: center; 
                  background-color: ${bcMinusHoursColor((emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2))};
                  color: ${fontMinusHoursColor((emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2))}
                  ">${(emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2) < 0 ? (emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2) : ''}</td>
                </tr>
                
              `
            }).join('')}
            <tr>
                  <th style="padding: 8px; text-align: center; font-weight: bold">S P O L U</th>
                  <th style="padding: 8px; text-align: center" colspan="6"></th>
                  <th style="padding: 8px; text-align: center; font-weight: bold">${currentCompliance.overtimeSum.toFixed(2)}</th>
                  <th style="padding: 8px; text-align: center; font-weight: bold">${currentCompliance.minusHoursSum.toFixed(2)}</th>
            </tr>
            
            ${currentComplianceMng.map(emp =>{
              return  `
                <tr>
                  <td style="padding: 8px; text-align: center">${emp.employee}</td>
                  <td style="padding: 8px; text-align: center">${ new Date(emp.state[0].start_date) >= new Date(monthStart) ? moment(emp.state[0].start_date).format('L') : ''}</td>
                  <td style="padding: 8px; text-align: center">${emp.termination_date ? moment(emp.termination_date).format('L') : ''}</td>
                  <td style="padding: 8px; text-align: center">${emp.absences.length}</td>
                  <td style="padding: 8px; text-align: center">${emp.state[0].contract}</td>
                  <td style="padding: 8px; text-align: center">${emp.workedHours[0].total_time.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: center">${emp.hoursFond[0].result.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: center">${(emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2) > 0 ? (emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2) : ''}</td>
                  <td style="padding: 8px; text-align: center; 
                  background-color: ${bcMinusHoursColor((emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2))};
                  color: ${fontMinusHoursColor((emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2))}
                  ">${(emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2) < 0 ? (emp.workedHours[0].total_time - emp.hoursFond[0].result).toFixed(2) : ''}</td>
                </tr>
                
              `
            }).join('')}
            <tr>
                  <th style="padding: 8px; text-align: center; font-weight: bold">S P O L U</th>
                  <th style="padding: 8px; text-align: center" colspan="6"></th>
                  <th style="padding: 8px; text-align: center; font-weight: bold">${currentCompliance.overtimeSumMng.toFixed(2)}</th>
                  <th style="padding: 8px; text-align: center; font-weight: bold">${currentCompliance.minusHoursSumMng.toFixed(2)}</th>
            </tr>
          

          </table>
          <br>
          <br>
          <br>
          <br>`
    })


    return html = `
      <h2>Good morning,</h2>
      <p>Please find below total hours planned / worked.</p>
      <br>

        ${unitShiftList.join('')}

      `;
  }

  function bcWeekendColor (day) {
    //const safeDay = day.replace(/\//g, '-');
    const dayOfWeek = moment(day, "YYYY-MM-DD").day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return '#C41230'; // Light RED for weekends
    } else {
      return '#FFFFFF'; // White for weekdays
    }
  }

  function fontWeekendColor (day) {
   // const safeDay = day.replace(/\//g, '-');
    const dayOfWeek = moment(day, "YYYY-MM-DD").day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return '#FFFFFF'; // White for weekends
    } else {
      return 'rgb(0, 0, 0)'; // Black for weekdays
    }
  }

  //change color of cell if number is more than -15


  function fontMinusHoursColor (num) {
    return num < -8 ? '#FFFFFF' : 'rgb(0, 0, 0)';
  }

  function bcMinusHoursColor (num){
    return num < -8 ? '#C41230' : '#FFFFFF';
  }

  function bcToDayColor (day) {
    const toDayObj = new Date();
    const toDay = `${toDayObj.getFullYear()}-${String(toDayObj.getMonth() + 1).padStart(2, '0')}-${String(toDayObj.getDate()).padStart(2, '0')}`;
    //console.log('safeDay:', toDay, day);
    if (day === toDay) {
      return '#D3D3D3'; // Light gray for today
    } else {
      return '#FFFFFF'; // other days white
    }
  }
 

  module.exports = {
    makeStoreShiftEmail
  }