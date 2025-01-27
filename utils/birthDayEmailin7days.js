const moment = require("moment");

function makeBirthDayEmailin7Days (employeesIn7Days){

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    //console.log(`tomorrow ${tomorrow}`);

    const sevenDayList = employeesIn7Days.map( (employee)=>{
      
        return `<tr>
        <td>${employee.unit}</td>
        <td>${employee.name} ${employee.last_name}</td>
        <td> will be ${ Math.abs( new Date(tomorrow - new Date(employee.birth_date)).getUTCFullYear() - 1970 ) } years old.</td>
      </tr>`
        
    })

   // console.log(tomorrowList.join(','));

    return html = `
      <h2>Good morning,</h2>
      <p>Please find below all employees who will celebrate their <strong>birthday in the next 7 days</strong>.</p>
      
      <table style="width:100%">
        <tr>
        <th style="width:15%; background-color: #D6EEEE">Store</th>
          <th style="width:25%; background-color: #D6EEEE">Employee Name</th>
          <th style="width:25%; background-color: #D6EEEE">Age</th>
        </tr>
        ${sevenDayList.join('')}
      </table>
      `;
  }

  module.exports = {
    makeBirthDayEmailin7Days
  }