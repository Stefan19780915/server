const moment = require("moment");

const makeMngOvertimeEmail = (unitData) => {
/*
    unitData.forEach(unit => {
        unit.employees.filter(e => e.state[0].contract === 'TPPM').forEach(element => {
        console.log('Employee:', element.employee,
                    'State:', element.state[0].contract,
                    'StateStart:', element.state[0].start_date, 
                    'Filtered Fond and Hours By Month:', element.filteredFondAndHoursByMonth.length,
                    'Overtime Sum:', element.overtimeSum  
                    )}
                );
        });
*/
    
    const storeTables = unitData.map(unit => {
        return `
            <table style="width:100%; border-collapse: collapse; border: 1px solid black;">
            <tr>
                <th style="width:100%; background-color: #C41230; padding: 8px; color:rgb(255, 255, 255)" colspan="14">${unit.unitName}</th>
            </tr>
                <tr>
                    <th style="width:12%;">Employee</th>
                    <th style="width:7%;">1</th>
                    <th style="width:7%;">2</th>
                    <th style="width:7%;">3</th>
                    <th style="width:7%;">4</th>
                    <th style="width:7%;">5</th>
                    <th style="width:7%;">6</th>
                    <th style="width:7%;">7</th>
                    <th style="width:7%;">8</th>
                    <th style="width:7%;">9</th>
                    <th style="width:7%;">10</th>
                    <th style="width:7%;">11</th>
                    <th style="width:7%;">12</th>
                    <th>YTM</th>
                </tr>
                ${unit.employees.filter(e => e.state[0].contract === 'TPPM').map(element => `
                    <tr>
                        <td style="padding: 8px; text-align: left">${element.employee}</td>
                        ${element.filteredFondAndHoursByMonth.map((monthData) => {
                            return `
                                <td style="padding: 8px; text-align: center">
                                    ${monthData.overtime > 0 ? monthData.overtime.toFixed(2) : ''}
                                </td>`;
                        }).join('')}
                
                        <td style="padding: 8px; text-align: center; background-color: ${bcOvertimeColor(element.overtimeSum)};
                  color: ${fontOvertimeColor(element.overtimeSum)}">${element.overtimeSum.toFixed(2)}</td>
                    </tr>`).join('')}
            </table>
            <br></br>
            `;
    }).join('');




   return html = `
      <h2>Good morning,</h2>
      <p>Please find below list of mng and their YTM overtime.</p>
      
        ${storeTables}
      
      `;


}

  function fontOvertimeColor (num) {
    return num > 100 ? '#FFFFFF' : 'rgb(0, 0, 0)';
  }

  function bcOvertimeColor (num){
    return num > 100 ? '#C41230' : '#FFFFFF';
  }


module.exports = {    makeMngOvertimeEmail
};