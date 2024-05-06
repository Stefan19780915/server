const moment = require("moment");

function makeEmail (oneEmployee){
    return html = `
      <h1>Hello</h1>
      <p>Please find below all personal data for employee to be registered from <span style="font-weight: bold"> ${moment(
        oneEmployee.contractStartDate
      ).format("LL")}</span> .</p>
      
      <table style="width:50%">
        <tr>
          <th style="width:25%; background-color: #D6EEEE">Peronal data</th>
          <th style="background-color: #D6EEEE">Employee</th>
        </tr>
        <tr>
          <td>Personal nuber</td>
          <td>${oneEmployee.personalNumber}</td>
        </tr>
        <tr>
          <td>First Name</td>
          <td>${oneEmployee.firstName}</td>
        </tr>
        <tr>
          <td>Last Name</td>
          <td>${oneEmployee.lastName}</td>
        </tr>

        <tr>
          <td>Birth Name</td>
          <td>${oneEmployee.birthName}</td>
        </tr>

        <tr>
          <td>Birth Date</td>
          <td>${moment(
            oneEmployee.birthDate
          ).format("LL")}</td>
        </tr>

        <tr>
          <td>Social Security Number</td>
          <td>${oneEmployee.socialSecNumber}</td>
        </tr>

        <tr>
          <td>ID Number</td>
          <td>${oneEmployee.idCardNumber}</td>
        </tr>

        <tr>
          <td>Birth Place</td>
          <td>${oneEmployee.birthPlace}</td>
        </tr>

        <tr>
          <td>Country</td>
          <td>${oneEmployee.country}</td>
        </tr>

        <tr>
          <td>Nationality</td>
          <td>${oneEmployee.nationality}</td>
        </tr>

        <tr>
          <td>Marital Status</td>
          <td>${oneEmployee.maritalStatus}</td>
        </tr>

        <tr>
          <td>Land Lie Phone</td>
          <td>${oneEmployee.landLinePhone}</td>
        </tr>

        <tr>
          <td>Mobile Phone</td>
          <td>${oneEmployee.mobilePhone}</td>
        </tr>

        <tr>
          <td>Email</td>
          <td>${oneEmployee.email}</td>
        </tr>

        <tr>
          <td>Password</td>
          <td>${oneEmployee.password}</td>
        </tr>

        <tr>
          <td>Address Street</td>
          <td>${oneEmployee.street}</td>
        </tr>

        <tr>
          <td>Address House Number</td>
          <td>${oneEmployee.houseNumber}</td>
        </tr>

        <tr>
          <td>Address City</td>
          <td>${oneEmployee.city}</td>
        </tr>

        <tr>
          <td>Address Postal Code</td>
          <td>${oneEmployee.postalCode}</td>
        </tr>


      </table>
      `;
  }

  module.exports = {
    makeEmail
  }