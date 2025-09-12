const moment = require("moment");



function makeUnitShiftEmail (unitShifts, headCount, compliance, monthStart){     

   // console.log('Unit Shifts:', unitShifts.filter(shift => shift.unitName = 'KFC Aupark Bratislava')[0]);
   const filteredUnits = unitShifts.filter(unit =>
        unit.unitName !== 'KFC Office' &&
        unit.unitName !== 'KFC Wörgl' &&
        unit.unitName !== 'KFC Lugner City'
    );

   // console.log(headCount);

    // Sort units alphabetically by unitName
   filteredUnits.sort((a, b) => a.unitName.localeCompare(b.unitName));
   //console.log('Filtered Units:', filteredUnits);
   //console.log('Unit Shifts:', filteredUnits.filter(shift => shift.unitName = 'KFC Aupark Bratislava')[0]);

   const sortedCompliance = compliance.sort((a, b)=> a.unitName.localeCompare(b.unitName));

  const complianceOvertimeSum = sortedCompliance.reduce((sum, c) => sum + (Number(c.overtimeSum) || 0), 0);
  const complianceMinusHoursSum = sortedCompliance.reduce((sum, c) => sum + (Number(c.minusHoursSum) || 0), 0);
  const complianceOvertimeSumMng = sortedCompliance.reduce((sum, c) => sum + (Number(c.overtimeSumMng) || 0), 0);
  const complianceMinusHoursSumMng = sortedCompliance.reduce((sum, c) => sum + (Number(c.minusHoursSumMng) || 0), 0);

  const complianceSummary = sortedCompliance.map(c =>{
              return `
                <tr>
                  <td style="padding: 8px; text-align: left">${c.unitName}</td>
                  <td style="padding: 8px; text-align: center">${c.overtimeSum.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: center">${c.minusHoursSum.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: center">${c.overtimeSumMng.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: center">${c.minusHoursSumMng.toFixed(2)}</td>
                </tr>
              `;

            }).join('');

    function hcSumTableUnits (tableDataNumStart,tableDataNumEnd){
        const hcSumTables1rowUnit = filteredUnits.slice(tableDataNumStart, tableDataNumEnd).map(u => {
      return `
          <th style="width:12.5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">${u.unitName}</th>
      `
    }).join('');
      return hcSumTables1rowUnit;
    } 
    
    function hcSumTableTPP (tableDataNumStart, tableDataNumEnd) {
      const hcSumTables2rowTPP = filteredUnits.slice(tableDataNumStart, tableDataNumEnd).map(u =>{
      const emp = headCount.find((element) => element.unitName == u.unitName);
      return `<td style="padding: 8px; text-align: center">${emp.TPP}</td>`;
    }).join('');
    return hcSumTables2rowTPP;
    }

    function hcSumTableMNG (tableDataNumStart, tableDataNumEnd) {
      const hcSumTables3rowMNG = filteredUnits.slice(tableDataNumStart, tableDataNumEnd).map(u =>{
        const emp = headCount.find((e)=> e.unitName == u.unitName);
        const mng = (Number(emp.RGM || 0) + (Number(emp.ARGM) || 0) + (Number(emp.SL || 0)) );
        return `<td style="padding: 8px; text-align: center">${mng}</td>`;
      }).join('');
      return hcSumTables3rowMNG;
    }

    function hcSumTableStudents (tableDataNumStart, tableDataNumEnd){
      const hcSumTables4rowStudents = filteredUnits.slice(tableDataNumStart, tableDataNumEnd).map(u =>{
        const emp = headCount.find((e)=> e.unitName == u.unitName);
        const students = (Number(emp.DOBPS || 0) + Number(emp.DOPC || 0));
        return `<td style="padding: 8px; text-align: center">${students}</td>`
      }).join('');
      return hcSumTables4rowStudents;
    }

     

    const unitShiftList = filteredUnits.map( (unitShift)=>{
        const TPP = headCount.find(unit => unit.unitName === unitShift.unitName).TPP;
        const DOBPS = headCount.find(unit => unit.unitName === unitShift.unitName).DOBPS;
        const DOPC = headCount.find(unit => unit.unitName === unitShift.unitName).DOPC;
        const SL = headCount.find(unit => unit.unitName === unitShift.unitName).SL;
        const ARGM = headCount.find(unit => unit.unitName === unitShift.unitName).ARGM;
        const RGM = headCount.find(unit => unit.unitName === unitShift.unitName).RGM;
        const hc = headCount.find(unit => unit.unitName === unitShift.unitName).headCount;

      
            const currentCompliance = compliance.find(c => c.unitId === unitShift.unitId);

           // console.log(currentCompliance.employees)
      
            const currentComplianceMng = currentCompliance.employees.filter(e =>{

              //check if the first 4 characters of  match e.state[0].contract "TPPM"
              const mng = e.state[0].contract.substring(0, 4) == 'TPPM';
              return mng;
            })

            const currentComplianceEmp = currentCompliance.employees.filter(e =>{
              const emp = e.state[0].contract.substring(0, 4) !== 'TPPM';
              return emp;
            })
           // console.log(unitShift.unitName, 'Manegers:', currentComplianceMng, 'Employees:', currentComplianceEmp );

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
                  <td style="padding: 8px; text-align: center">Pracovný Fond</td>
                  <td style="padding: 8px; text-align: center">Uväzok</td>
                  <td style="padding: 8px; text-align: center">Odpracované hodiny</td>
                  <td style="padding: 8px; text-align: center">Nadčas</td>
                  <td style="padding: 8px; text-align: center">Chýbajúce hodiny</td>    
            </tr>


            ${currentComplianceEmp.map(emp =>{
              return  `
                <tr>
                  <td style="padding: 8px; text-align: center">${emp.employee}</td>
                  <td style="padding: 8px; text-align: center">${ new Date(emp.state[0].start_date.split("T")[0]) >= new Date(monthStart) ? moment(emp.state[0].start_date).format('L') : ''}</td>
                  <td style="padding: 8px; text-align: center">${emp.termination_date ? moment(emp.termination_date).format('L') : ''}</td>
                  <td style="padding: 8px; text-align: center">${emp.absences.length}</td>
                  <td style="padding: 8px; text-align: center">${emp.hoursFond[0].result.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: center">${emp.state[0].contract}</td>
                  <td style="padding: 8px; text-align: center">${emp.workedHours[0].total_time.toFixed(2)}</td>
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
                  <th style="padding: 8px; text-align: center" colspan="5"></th>
                  <th style="padding: 8px; text-align: center; font-weight: bold">${currentCompliance.fullTimeHoursSum.toFixed(2)}</th>
                  <th style="padding: 8px; text-align: center; font-weight: bold">${currentCompliance.overtimeSum.toFixed(2)}</th>
                  <th style="padding: 8px; text-align: center; font-weight: bold">${currentCompliance.minusHoursSum.toFixed(2)}</th>
            </tr>
            <tr>
                  <th style="padding: 8px; text-align: center; font-weight: bold">STUDENTS</th>
                  <th style="padding: 8px; text-align: center" colspan="5"></th>
                  <th style="padding: 8px; text-align: center; font-weight: bold">${currentCompliance.partTimeHoursSum.toFixed(2)}</th>

            </tr>


            ${currentComplianceMng.map(emp =>{
              return  `
                <tr>
                  <td style="padding: 8px; text-align: center">${emp.employee}</td>
                  <td style="padding: 8px; text-align: center">${ new Date(emp.state[0].start_date.split("T")[0]) >= new Date(monthStart) ? moment(emp.state[0].start_date).format('L') : ''}</td>
                  <td style="padding: 8px; text-align: center">${emp.termination_date ? moment(emp.termination_date).format('L') : ''}</td>
                  <td style="padding: 8px; text-align: center">${emp.absences.length}</td>
                  <td style="padding: 8px; text-align: center">${emp.hoursFond[0].result.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: center">${emp.state[0].contract}</td>
                  <td style="padding: 8px; text-align: center">${emp.workedHours[0].total_time.toFixed(2)}</td>
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
                  <th style="padding: 8px; text-align: center" colspan="5"></th>
                  <th style="padding: 8px; text-align: center; font-weight: bold">${currentCompliance.mngHoursSum.toFixed(2)}</th>
                  <th style="padding: 8px; text-align: center; font-weight: bold">${currentCompliance.overtimeSumMng.toFixed(2)}</th>
                  <th style="padding: 8px; text-align: center; font-weight: bold">${currentCompliance.minusHoursSumMng.toFixed(2)}</th>
            </tr>




          </table>
          <br></br>
          `
    })


    return html = `
      <h2>Good morning,</h2>
      <p>Please find below all units with their shifts and total hours planned / worked.</p>

      <table style="width:100%; border-collapse: collapse; border: 1px solid black;">
            <tr>
            <th style="width:100%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)" colspan="5">Compliance Summary ----- From: ${monthStart} ----- To: ${filteredUnits[0].currentWeekShifts[6].date}</th>
            </tr>
            <tr>
            <th style="text-align: left; padding: 8px">Unit</th>
            <th style="text-align: center; padding: 8px">Overtime TPP</th>
            <th style="text-align: center; padding: 8px">Minus Hour TPP</th>
            <th style="text-align: center; padding: 8px">Overtime MNG</th>
            <th style="text-align: center; padding: 8px">Minus Hour MNG</th>
            </tr>
            ${complianceSummary}
           <tr>
            <th style="text-align: left; font-weight: bold; padding: 8px">T O T A L</th>
            <th style="text-align: center; font-weight: bold; padding: 8px">${complianceOvertimeSum.toFixed(2)}</th>
            <th style="text-align: center; font-weight: bold; padding: 8px">${complianceMinusHoursSum.toFixed(2)}</th>
            <th style="text-align: center; font-weight: bold; padding: 8px">${complianceOvertimeSumMng.toFixed(2)}</th>
            <th style="text-align: center; font-weight: bold; padding: 8px">${complianceMinusHoursSumMng.toFixed(2)}</th>
           </tr> 
      </table>

      <br></br>

      <table style="width:100%; border-collapse: collapse; border: 1px solid black;">
        <tr>
          <th style="width:5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">Type</th>
          ${hcSumTableUnits (0, 8)}
        </tr>
        <tr>
          <td style="padding: 8px; text-align: center">TPP</td>
          ${hcSumTableTPP(0, 8)}
        </tr>
        <tr>
          <td style="padding: 8px; text-align: center">MNG</td>
          ${hcSumTableMNG(0,8)}
        </tr>
        <tr>
          <td style="padding: 8px; text-align: center">Students</td>
          ${hcSumTableStudents(0,8)}
        </tr>
      </table>

      <table style="width:100%; border-collapse: collapse; border: 1px solid black;">
        <tr>
          <th style="width:5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">Type</th>
          ${hcSumTableUnits (8, 16)}
        </tr>
        <tr>
          <td style="padding: 8px; text-align: center">TPP</td>
          ${hcSumTableTPP(8, 16)}
        </tr>
        <tr>
          <td style="padding: 8px; text-align: center">MNG</td>
          ${hcSumTableMNG(8,16)}
        </tr>
        <tr>
          <td style="padding: 8px; text-align: center">Students</td>
          ${hcSumTableStudents(8,16)}
        </tr>
      </table>

      <table style="width:100%; border-collapse: collapse; border: 1px solid black;">
        <tr>
          <th style="width:5%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)">Type</th>
          ${hcSumTableUnits (16, 17)}
        </tr>
        <tr>
          <td style="padding: 8px; text-align: center">TPP</td>
          ${hcSumTableTPP(16, 17)}
        </tr>
        <tr>
          <td style="padding: 8px; text-align: center">MNG</td>
          ${hcSumTableMNG(16, 17)}
        </tr>
        <tr>
          <td style="padding: 8px; text-align: center">Students</td>
          ${hcSumTableStudents(16, 17)}
        </tr>
      </table>


      <br></br>

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
    makeUnitShiftEmail
  }