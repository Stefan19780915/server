const moment = require("moment");


function makeUnitSalesEmail (unitSales,startOfWeek){

   // console.log(unitSales)

    const filteredUnits = unitSales.filter(unit =>
        unit.unitName !== 'KFC Office' &&
        unit.unitName !== 'KFC Wörgl' &&
        unit.unitName !== 'KFC Lugner City' &&
        unit.unitName !== 'KFC Novum Prešov'
    );
    // Sort units alphabetically by unitName
    filteredUnits.sort((a, b) => a.unitName.localeCompare(b.unitName));
    const allDates = [...filteredUnits[0].previousWeekSales,...filteredUnits[0].currentWeekSales];

    const unitSalesTable = filteredUnits.map( unit =>{

        return `
             <tr>
                  <td style="padding: 8px; text-align: center">${unit.unitName}</td>
                  ${unit.previousWeekSales.map(date=>{
                    return `<td style="padding: 8px; text-align: center; background-color:${bcToDayColor(date.date)}">€${date.totalSales.toFixed()}</td>`
                  }).join('')}
                  ${unit.currentWeekSales.map(date=>{
                    return `<td style="padding: 8px; text-align: center; background-color:${bcToDayColor(date.date)}">€${date.totalSales.toFixed()}</td>`
                  }).join('')}
             </tr>
        `
    }).join('')

    const unitChecksTable = filteredUnits.map( unit =>{

        return `
             <tr>
                  <td style="padding: 8px; text-align: center">${unit.unitName}</td>
                  ${unit.previousWeekSales.map(date=>{
                    return `<td style="padding: 8px; text-align: center; background-color:${bcToDayColor(date.date)}">${date.totalChecks.toFixed()}</td>`
                  }).join('')}
                  ${unit.currentWeekSales.map(date=>{
                    return `<td style="padding: 8px; text-align: center; background-color:${bcToDayColor(date.date)}">${date.totalChecks.toFixed()}</td>`
                  }).join('')}
             </tr>
        `
    }).join('')

    
return `
    <table style="width:100%; border-collapse: collapse; border: 1px solid black;">
                <tr>
                    <th style="padding: 8px; text-align: center; font-weight: bold">Unit SALES</th>
                    ${allDates.map(date=>{
                        return`
                            <th style="padding: 8px; text-align: center; background-color:${bcToDayColor(date.date)}; font-weight: bold">${date.date}</th>
                        `
                    }).join('')}
                </tr>
                ${unitSalesTable}
    </table>
    <br></br>
    <table style="width:100%; border-collapse: collapse; border: 1px solid black;">
                <tr>
                    <th style="padding: 8px; text-align: center; font-weight: bold">Unit CHECKS</th>
                    ${allDates.map(date=>{
                        return`
                            <th style="padding: 8px; text-align: center; background-color:${bcToDayColor(date.date)}; font-weight: bold">${date.date}</th>
                        `
                    }).join('')}
                </tr>
                ${unitChecksTable}
    </table>
`;


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
    makeUnitSalesEmail
}