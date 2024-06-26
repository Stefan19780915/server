const Employee = require("../model/Employee");
const Contract = require('../model/Contract');
const moment = require("moment");
moment.locale("sk");

async function dataCheck (req, res, next){

    const data = await Employee.findOne({ _id: req.params.id }).populate(
        "store"
      ).populate("position");

      const contract = await Contract.findOne({ employee: data._id, contractState: true});

      if(!contract) {

        req.flash(
          "message",
          `There is no ACTIVE contract for ${data.firstName} ${data.lastName}. 
          Please create a new contract or activate an existing one.`
        );
        res.redirect("/employee");

      } else { 

      switch (true) {
        
        case contract.contractType == 'DOBPŠ' && contract.contractWeeklyHours > 20 : 
        req.flash(
          "message",
          `Please change the contracted weekly hours to 20 hours. Students contracts ${contract.contractType} cannot work more than 20 hours a week.`
        );
        res.redirect("/employee");
        break;

        case contract.contractType == 'DOPČ' && contract.contractWeeklyHours > 10 : 
        req.flash(
          "message",
          `Please change the contracted weekly hours to 10 hours. Part time contracts ${contract.contractType} cannot work more than 10 hours a week.`
        );
        res.redirect("/employee");
        break;
        
        case contract.contractType == 'DOBPŠ' && contract.contractSalaryType == 'monthlySalary':
        req.flash(
            "message",
            `Please change the salry type to hourly rate. Students contracts ${contract.contractType} work on hourly rate.`
        );
        res.redirect("/employee");
        break;

        case contract.contractType == 'DOPČ' && contract.contractSalaryType == 'monthlySalary':
        req.flash(
            "message",
            `Please change the salry type to hourly rate. Part time contracts ${contract.contractType} work on hourly rate.`
        );
        res.redirect("/employee");
        break;

        case contract.studentCompensation == true && !contract.compensationDateStart:
        req.flash(
            "message",
            `Please specify the student compensation start date.`
        );
        res.redirect("/employee");
        break;

        case contract.studentCompensation == false && contract.compensationDateStart:
        req.flash(
            "message",
            `Please select the checkbox for the student compensation start date.`
        );
        res.redirect("/employee");
        break;

        case !contract.contractType || !contract.contractEndDate:
          req.flash(
            "message",
            `Please specify a contract type and contract end date for the employee.`
          );
          res.redirect("/employee");
          break;


        default:
        next();
        console.log('Contract is checked');
      }
    }

}


module.exports = {
    dataCheck
}