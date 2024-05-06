const Employee = require("../model/Employee");
const moment = require("moment");
moment.locale("sk");

async function dataCheck (req, res, next){

    const data = await Employee.findOne({ _id: req.params.id }).populate(
        "store"
      ).populate("position");

      switch (true) {
        
        case data.contractType == 'DOBPŠ' && data.contractWeeklyHours > 20 : 
        req.flash(
          "message",
          `Please change the contracted weekly hours to 20 hours. Students contracts ${data.contractType} cannot work more than 20 hours a week.`
        );
        res.redirect("/employee");
        break;

        case data.contractType == 'DOPČ' && data.contractWeeklyHours > 10 : 
        req.flash(
          "message",
          `Please change the contracted weekly hours to 10 hours. Part time contracts ${data.contractType} cannot work more than 10 hours a week.`
        );
        res.redirect("/employee");
        break;
        
        case data.contractType == 'DOBPŠ' && data.contractSalaryType == 'monthlySalary':
        req.flash(
            "message",
            `Please change the salry type to hourly rate. Students contracts ${data.contractType} work on hourly rate.`
        );
        res.redirect("/employee");
        break;

        case data.contractType == 'DOPČ' && data.contractSalaryType == 'monthlySalary':
        req.flash(
            "message",
            `Please change the salry type to hourly rate. Part time contracts ${data.contractType} work on hourly rate.`
        );
        res.redirect("/employee");
        break;

        case data.studentCompensation == true && !data.compensationDateStart:
        req.flash(
            "message",
            `Please specify the student compensation start date.`
        );
        res.redirect("/employee");
        break;

        case data.studentCompensation == false && data.compensationDateStart:
        req.flash(
            "message",
            `Please select the checkbox for the student compensation start date.`
        );
        res.redirect("/employee");
        break;

        case !data.contractType || !data.contractEndDate || data.contractEndDate == 'indefinite':
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


module.exports = {
    dataCheck
}