const moment = require("moment");

function makeSeniorityEmail (month0, month1,month2){

    let now = new Date();


    const monthList = function (month){

        const oneYearList = month.emp1.map( emp => {
            return `<tr>
                    <td>${emp.unit}</td>
                    <td>${emp.name} ${emp.last_name}</td>
                    <td>${moment(emp.hired_date).format('LL') }</td>
                    <td> will celebrate 1 year with the company </td>
                  </tr>`
        })
    
        const threeYearList = month.emp3.map( emp => {
            return `<tr>
                    <td>${emp.unit}</td>
                    <td>${emp.name} ${emp.last_name}</td>
                    <td>${moment(emp.hired_date).format('LL') }</td>
                    <td> will be celebrate 3 years with teh company.</td>
                  </tr>`
        })
    
        const fiveYearList = month.emp5.map( emp => {
            return `<tr>
                    <td>${emp.unit}</td>
                    <td>${emp.name} ${emp.last_name}</td>
                    <td>${moment(emp.hired_date).format('LL') }</td>
                    <td> will be celebrate 5 years with teh company.</td>
                  </tr>`
        })

        const tenYearList = month.emp10.map( emp => {
            return `<tr>
                    <td>${emp.unit}</td>
                    <td>${emp.name} ${emp.last_name}</td>
                    <td>${moment(emp.hired_date).format('LL') }</td>
                    <td> will be celebrate 10 years with teh company.</td>
                  </tr>`
        })

        const fifteenYearList = month.emp15.map( emp => {
            return `<tr>
                    <td>${emp.unit}</td>
                    <td>${emp.name} ${emp.last_name}</td>
                    <td>${moment(emp.hired_date).format('LL') }</td>
                    <td> will be celebrate 15 years with teh company.</td>
                  </tr>`
        })

        const twentyYearList = month.emp20.map( emp => {
            return `<tr>
                    <td>${emp.unit}</td>
                    <td>${emp.name} ${emp.last_name}</td>
                    <td>${moment(emp.hired_date).format('LL') }</td>
                    <td> will be celebrate 20 years with teh company.</td>
                  </tr>`
        })

        const twentyFiveYearList = month.emp25.map( emp => {
            return `<tr>
                    <td>${emp.unit}</td>
                    <td>${emp.name} ${emp.last_name}</td>
                    <td>${moment(emp.hired_date).format('LL') }</td>
                    <td> will be celebrate 25 years with teh company.</td>
                  </tr>`
        })

        return `
            ${oneYearList.join('')}
            ${threeYearList.join('')}
            ${fiveYearList.join('')}
            ${tenYearList.join('')}
            ${fifteenYearList.join('')}
            ${twentyYearList.join('')}
            ${twentyFiveYearList.join('')}
        `

    }

    return html = `
          <h2>Good morning,</h2>
          <p>Please find below all employees who will celebrate theri anniversary in <strong> ${moment(now).format("MMMM")}</strong>.</p>
          <table style="width:100%">
            <tr>
            <th style="width:15%; background-color: #D6EEEE">Store</th>
              <th style="width:25%; background-color: #D6EEEE">Employee Name</th>
              <th style="width:15%; background-color: #D6EEEE">Hire Date On</th>
              <th style="width:25%; background-color: #D6EEEE">Anniversary</th>
            </tr>
            ${monthList(month0)}
          </table>
    
          <br></br>
    
          <p>Please find below all employees who will celebrate theri anniversary in <strong>${moment(new Date().setMonth(new Date().getMonth() +1)).format("MMMM")}</strong></p>
          <table style="width:100%">
            <tr>
              <th style="width:15%; background-color: #D6EEEE">Store</th>
              <th style="width:25%; background-color: #D6EEEE">Employee Name</th>
              <th style="width:15%; background-color: #D6EEEE">Hire Date On</th>
              <th style="width:25%; background-color: #D6EEEE">Anniversary</th>
            </tr>
            ${monthList(month1)}
          </table>

          <p>Please find below all employees who will celebrate theri anniversary in <strong>${moment(new Date().setMonth(new Date().getMonth() +2)).format("MMMM")}</strong></p>
          <table style="width:100%">
            <tr>
              <th style="width:15%; background-color: #D6EEEE">Store</th>
              <th style="width:25%; background-color: #D6EEEE">Employee Name</th>
              <th style="width:15%; background-color: #D6EEEE">Hire Date On</th>
              <th style="width:25%; background-color: #D6EEEE">Anniversary</th>
            </tr>
            ${monthList(month2)}
          </table>

          `;

}

module.exports = {
    makeSeniorityEmail
  }