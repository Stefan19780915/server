const Store = require("../model/Store");
const Employee = require("../model/Employee");
const Contract = require('../model/Contract');
const Positions = require("../model/Positions");

const createContract = async (req, res) => {

    const employee = await Employee.findOne({_id: req.params.id}).populate('store').populate('position');
    const position = req.body.position != '0' ? await Positions.findOne({ _id: req.body.position }) : '';

    const employeeContracts = await Contract.find({ employee: req.params.id, contractState: true});

    console.log(employeeContracts);

  if (employeeContracts.length > 0) {
    req.flash("message", "More contracts have ACTIVE STATE - Only 1 contract can have active state. Please disable active states on other contracts.");
    return res.redirect("/employee");
  }

     const newContract = {
       employee: employee._id,
       position: req.body.position == '0' ? employee.position : position,
       store: employee.store,
       contractStartDate: req.body.contractStartDate,
       contractEndDate: !req.body.contractEndDate ? 'indefinite' : req.body.contractEndDate,
       contractSalaryType: req.body.contractSalaryType,
       contractSalary: req.body.contractSalary,
       contractType: req.body.contractType,
       contractWeeklyHours: req.body.contractWeeklyHours,
       studentCompensation: !req.body.studentCompensation ? false : true,
       compensationDateStart: req.body.compensationDateStart,
       contractState: !req.body.contractState ? false : true
     };

     if (
      !newContract.contractStartDate ||
      !newContract.contractEndDate ||
      !newContract.contractSalaryType ||
      !newContract.contractSalary ||
      !newContract.contractType ||
      !newContract.contractWeeklyHours
    ) {
      req.flash("message", `Contract Start date, 
                            Contract End date, 
                            Salary Type, 
                            Salary, 
                            Contract type, 
                            Weekly hours are required.`);
      return res.redirect("/employee");
    }

     if (!newContract.employee || !employee._id) {
       req.flash("message", `No such employee.`);
       res.redirect("/employee");
       return
     }
   
     try {
       const result = await Contract.create(newContract);
       req.flash(
         "message",
         `Contract for ${employee.firstName} ${employee.lastName} was created successfully.`
       );
       res.redirect("/employee");
     } catch (err) {
       console.log(err);
     }
   };

   // UPDATE CONTRACT AND REDIRECT TO EMPLOYEE ROUTE
const updateContract = async (req, res) => {

//console.log(req.params);

  if (!req.params.id) {
    req.flash("message", "Id parameter is rewuired");
    return res.redirect("/pages/404");
  }
  const contract = await Contract.findOne({ _id: req.params.id }).populate('position').populate('store').populate('employee').exec();

  const employeeContracts = await Contract.find({ _id: req.params.id, contractState: true });

  if (employeeContracts.length > 0) {
    req.flash("message", "More contracts have ACTIVE STATE - Only 1 contract can have active state. Please disable active states on other contracts.");
    return res.redirect("/employee");
  }

//console.log(req.body)

  if (!contract) {
    req.flash("message", "No Contract found.");
    return res.redirect("/pages/404");
  }

  if (!req.body.contractState) {
    contract.contractState = false;
  } else {
    contract.contractState = true;
  }

  if (req.body.contractStartDate)
    contract.contractStartDate = req.body.contractStartDate;
  if (req.body.contractEndDate)
    contract.contractEndDate = req.body.contractEndDate;
    if (!req.body.contractEndDate)
    contract.contractEndDate = '';

  if (req.body.contractSalaryType)
    contract.contractSalaryType = req.body.contractSalaryType;
  if (req.body.contractSalary)
    contract.contractSalary = req.body.contractSalary;
  if (req.body.contractType) contract.contractType = req.body.contractType;
  if (req.body.contractWeeklyHours)
    contract.contractWeeklyHours = req.body.contractWeeklyHours;
    if (req.body.position != 0) {
      contract.position = req.body.position;
    } else {
      contract.position;
    }
    if (!req.body.studentCompensation) {
      contract.studentCompensation = false;
    } else {
      contract.studentCompensation = true;
    }

  if(req.body.compensationDateStart) contract.compensationDateStart = req.body.compensationDateStart;

  if(!req.body.compensationDateStart) contract.compensationDateStart = '';

  //console.log(req.body.studentCompensation);

  const result = await contract.save();

  if (result != undefined) {
    req.flash(
      "message",
      `Contract data for ${result.employee.firstName} ${result.employee.lastName} was updated successfully.`
    );
    res.redirect("/employee");
  } else {
    req.flash("message", "Contract data was not updated..");
    return res.redirect("/pages/404");
  }
};


const deleteContract = async (req, res)=>{

  console.log(req.params.id);

  const contract = await Contract.findOne({_id: req.params.id}).populate('employee');

  console.log(contract.contractStartDate);

  try {
    const result = await contract.deleteOne({ _id: req.params.id });
    if(result){
      req.flash(
        "message",
        `Contract data for ${contract.employee.firstName} ${contract.employee.lastName} was deleted successfully.`
      );
      res.redirect("/employee");
    }
  } catch (err) {
    req.flash("message", `Contract data was not deleted.. because of the ${err} error.`);
    return res.redirect("/pages/404");
    console.log(err);
  }

}


module.exports = {
    createContract,
    updateContract,
    deleteContract
  };