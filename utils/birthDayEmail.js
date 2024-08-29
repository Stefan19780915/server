const moment = require("moment");

function makeBirthDayEmail (employeesTomorrow, employeesIn7Days){

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    //console.log(`tomorrow ${tomorrow}`);

    const tomorrowList = employeesTomorrow.map( (employee)=>{
        return `<tr>
        <td>${employee.unit}</td>
        <td>${employee.name} ${employee.last_name}</td>
        <td>${moment(employee.birth_date).format('LL') }</td>
        <td> will be ${ Math.abs( new Date(tomorrow - new Date(employee.birth_date)).getUTCFullYear() - 1970 ) } years old.</td>
      </tr>`
        
    })

    const sevenDayList = employeesIn7Days.map( (employee)=>{

        return `<tr>
        <td>${employee.unit}</td>
        <td>${employee.name} ${employee.last_name}</td>
        <td>${moment(employee.birth_date).year(moment().year()).format('LL')}</td>
        <td> will be ${ Math.abs( new Date(tomorrow - new Date(employee.birth_date)).getUTCFullYear() - 1970 ) } years old.</td>
      </tr>`
        
    })

   // console.log(tomorrowList.join(','));

    return html = `
      <h2>Good morning,</h2>
      <p>Please find below all employees who will celebrate their birthday <strong>tomorrow - on the ${moment(tomorrow).format("LL")}</strong>.</p>
      <table style="width:100%">
        <tr>
        <th style="width:15%; background-color: #D6EEEE">Store</th>
          <th style="width:25%; background-color: #D6EEEE">Employee Name</th>
          <th style="width:15%; background-color: #D6EEEE">Birth Date</th>
          <th style="width:25%; background-color: #D6EEEE">Age</th>
        </tr>
        ${tomorrowList.join('')}
      </table>

      <br></br>

      <p>Please find below all employees who will celebrate their <strong>birthday in the next 7 days</strong></p>
      <table style="width:100%">
        <tr>
          <th style="width:15%; background-color: #D6EEEE">Store</th>
          <th style="width:25%; background-color: #D6EEEE">Employee Name</th>
          <th style="width:15%; background-color: #D6EEEE">Birth Date</th>
          <th style="width:25%; background-color: #D6EEEE">Age</th>
        </tr>
        ${sevenDayList.join('')}
      </table>
      `;
  }

  module.exports = {
    makeBirthDayEmail
  }