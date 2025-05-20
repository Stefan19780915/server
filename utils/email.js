const moment = require("moment");

function makeEmail (oneEmployee){
    return html = `
      <h1>Hello</h1>
      <p>Please find below all personal data for employee to be registered from <span style="font-weight: bold"> ${moment(
        oneEmployee.contractStartDate
      ).format("LL")}</span> .</p>
      
      <table style="width:50%">
        <tr>
          <th style="width:50%; background-color: #C41230; color: #FFFFFF"">Peronal data</th>
          <th style="background-color: #C41230; color: #FFFFFF"">Employee</th>
        </tr>
        <tr>
          <td>Personal nuber</td>
          <td>${oneEmployee.employee.personalNumber}</td>
        </tr>
        <tr>
          <td>First Name</td>
          <td>${oneEmployee.employee.firstName}</td>
        </tr>
        <tr>
          <td>Last Name</td>
          <td>${oneEmployee.employee.lastName}</td>
        </tr>

        <tr>
          <td>Birth Name</td>
          <td>${oneEmployee.employee.birthName}</td>
        </tr>

        <tr>
          <td>Birth Date</td>
          <td>${moment(
            oneEmployee.employee.birthDate
          ).format("LL")}</td>
        </tr>

        <tr>
          <td>Social Security Number</td>
          <td>${oneEmployee.employee.socialSecNumber}</td>
        </tr>

        <tr>
          <td>ID Number</td>
          <td>${oneEmployee.employee.idCardNumber}</td>
        </tr>

        <tr>
          <td>Birth Place</td>
          <td>${oneEmployee.employee.birthPlace}</td>
        </tr>

        <tr>
          <td>Country</td>
          <td>${oneEmployee.employee.country}</td>
        </tr>

        <tr>
          <td>Nationality</td>
          <td>${oneEmployee.employee.nationality}</td>
        </tr>

        <tr>
          <td>Marital Status</td>
          <td>${oneEmployee.employee.maritalStatus}</td>
        </tr>

        <tr>
          <td>Land Lie Phone</td>
          <td>${oneEmployee.employee.landLinePhone}</td>
        </tr>

        <tr>
          <td>Mobile Phone</td>
          <td>${oneEmployee.employee.mobilePhone}</td>
        </tr>

        <tr>
          <td>Email</td>
          <td>${oneEmployee.employee.email}</td>
        </tr>

        <tr>
          <td>Password</td>
          <td>${oneEmployee.employee.password}</td>
        </tr>

        <tr>
          <td>Address Street</td>
          <td>${oneEmployee.employee.street}</td>
        </tr>

        <tr>
          <td>Address House Number</td>
          <td>${oneEmployee.employee.houseNumber}</td>
        </tr>

        <tr>
          <td>Address City</td>
          <td>${oneEmployee.employee.city}</td>
        </tr>

        <tr>
          <td>Address Postal Code</td>
          <td>${oneEmployee.employee.postalCode}</td>
        </tr>

        <tr>
          <td>Address Temporary</td>
          <td>${oneEmployee.employee.streetTemp}</td>
        </tr>

        <tr>
          <td>Address Temporary</td>
          <td>${oneEmployee.employee.houseNumberTemp}</td>
        </tr>

        <tr>
          <td>Address Temporary</td>
          <td>${oneEmployee.employee.cityTemp}</td>
        </tr>

        <tr>
          <td>Address Temporary</td>
          <td>${oneEmployee.employee.postalCodeTemp}</td>
        </tr>

        <tr>
          <td>Spouse Name</td>
          <td>${oneEmployee.employee.spouseName}</td>
        </tr>

        <tr>
          <td>Spouse Name</td>
          <td>${oneEmployee.employee.spouseSurname}</td>
        </tr>

        <tr>
          <td>Spouse Date of Birth</td>
          <td>${moment(
            oneEmployee.employee.spouseDateOfBirth
          ).format("LL")}</td>
        </tr>

        <tr>
          <td>Spouse Social Security Number</td>
          <td>${oneEmployee.employee.spouseSocialSecNumber}</td>
        </tr>

        <tr>
          <td>Spouse Social Security Number</td>
          <td>${oneEmployee.employee.publicHealthInsuranceName}</td>
        </tr>

        <tr>
          <td>ZTP/Dochodca</td>
          <td>${oneEmployee.employee.ztpDochodca}</td>
        </tr>

        <tr>
          <td>Bank Name</td>
          <td>${oneEmployee.employee.bankName}</td>
        </tr>

        <tr>
          <td>Account Number</td>
          <td>${oneEmployee.employee.accountNumber}</td>
        </tr>

        <tr>
          <td>Bank Code</td>
          <td>${oneEmployee.employee.bankCode}</td>
        </tr>

        <tr>
          <td>Contract Start Date</td>
          <td>${moment(
            oneEmployee.contractStartDate
          ).format("LL")}</td>
        </tr>

        <tr>
          <td>Contract End Date</td>
          <td>${oneEmployee.contractEndDate == 'indefinite' ? "Indefinite period" : !oneEmployee.contractEndDate ? 'No end date specified.' : moment(
            oneEmployee.contractEndDate
          ).format("LL")}</td>
        </tr>

        <tr>
          <td>Contract Salary Type</td>
          <td>${oneEmployee.contractSalaryType}</td>
        </tr>

        <tr>
          <td>Contract Salary</td>
          <td>${oneEmployee.contractSalary} EUR</td>
        </tr>

        <tr>
          <td>Contract Type</td>
          <td>${oneEmployee.contractType}</td>
        </tr>

        <tr>
          <td>Contract Weekly Hours</td>
          <td>${oneEmployee.contractWeeklyHours}</td>
        </tr>

        <tr>
        <td>Position</td>
        <td>${oneEmployee.position.position == undefined ? "Position not specified" : oneEmployee.position.position}</td>
      </tr>


      </table>
      `;
  }

  module.exports = {
    makeEmail
  }