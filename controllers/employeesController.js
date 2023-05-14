const Employee = require("../model/Employee");
const moment = require("moment");
moment.locale("en");

//DONE
const getAllEmployees = async (req, res) => {
  const allEmployees = await Employee.find();
  if (allEmployees === []) {
    return res.render("../views/pages/employees", {
      msg: "There are no employees created yet. Click on create employee.",
      data: "",
      user: req.user,
    });
  }
  res.render("../views/pages/employees", {
    msg: false,
    data: allEmployees,
    user: req.user,
  });
};

//DONE
const getEmployee = async (req, res) => {
  if (!req.params.id) {
    return res.render("../views/pages/404", {
      msg: "Employee was not deleted.",
      body: "Please pprovide the correct ID",
      user: req.user,
    });
  }
  const oneEmployee = await Employee.findOne({ _id: req.params.id });
  if (oneEmployee != undefined) {
    res.render("../views/pages/employee", {
      msg: false,
      data: oneEmployee,
      user: req.user,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
      user: req.user,
    });
  }
};

const createEmployee = async (req, res) => {
  const newEmployee = {
    employeeState: req.body.employeeState,
    personalNumber: req.body.personalNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    birthDate: req.body.birthDate,
    birthPlace: req.body.birthPlace,
    socialSecNumber: req.body.socialSecNumber,
    idCardNumber: req.body.idCardNumber,
    country: req.body.country,
    nationality: req.body.nationality,
    maritalStatus: req.body.maritalStatus,
  };

  if (newEmployee.employeeState == "on") {
    newEmployee.employeeState = true;
  } else if (!newEmployee.employeeState) {
    newEmployee.employeeState = false;
  } else {
    return;
  }

  if (
    !newEmployee.personalNumber ||
    !newEmployee.firstName ||
    !newEmployee.lastName ||
    !newEmployee.gender ||
    !newEmployee.birthDate ||
    !newEmployee.birthPlace ||
    !newEmployee.socialSecNumber ||
    !newEmployee.idCardNumber ||
    !newEmployee.country ||
    !newEmployee.nationality ||
    !newEmployee.maritalStatus
  ) {
    return res.render("../views/pages/employees", {
      msg: "All fields are required",
      body: "",
      data: data.employees,
      user: req.user,
    });
  }

  try {
    const result = await Employee.create(newEmployee);
    const allEmployees = await Employee.find();
    console.log(result);
    res.render("../views/pages/employees", {
      msg: `Employee was created successfully`,
      body: `${result.firstName} ${result.lastName}`,
      data: allEmployees,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
  }
};

//DONE
const deleteEmployee = async (req, res) => {
  if (!req.params.id) {
    return res.render("../views/pages/404", {
      msg: "Employee was not deleted.",
      body: "Please pprovide the correct ID",
      user: req.user,
    });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res.render("../views/pages/404", {
      msg: "No employee found.",
      body: "Please provide the correct ID.",
      user: req.user,
    });
  }

  const result = await employee.deleteOne({ _id: req.params.id });

  const allEmployees = await Employee.find();

  if (!allEmployees) {
    return res.render("../views/pages/employees", {
      msg: "There are no employees created yet. Click on create employee.",
      body: "",
      data: "",
      user: req.user,
    });
  }

  res.render("../views/pages/employees", {
    msg: `Personal data of the employee was deleted.`,
    body: `${result.firstName} ${result.lastName}`,
    data: allEmployees,
    user: req.user,
  });
};

//DONE
const createChild = async (req, res) => {
  const newChild = {
    childName: req.body.childName,
    childSurname: req.body.childSurname,
    childDateOfBirth: req.body.childDateOfBirth,
    childSocialSecNumber: req.body.childSocialSecNumber,
  };

  if (
    !newChild.childName ||
    !newChild.childSurname ||
    !newChild.childDateOfBirth ||
    !newChild.childSocialSecNumber
  ) {
    return res.render("../views/pages/employee", {
      msg: "All fields are required",
      body: "",
      data: result,
      user: req.user,
    });
  }

  try {
    const oneEmployee = await Employee.findOne({ _id: req.params.id });
    oneEmployee.children.push(newChild);
    await oneEmployee.save();

    const allEmployees = await Employee.find();
    res.status(201).render("../views/pages/employees", {
      msg: `Child ${newChild.childName} ${newChild.childSurname} data was saved`,
      body: "By clicking OK you may proceed.",
      data: allEmployees,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
  }
};

//DONE
const deleteChild = async (req, res) => {
  //const result = data.employees.find((item) => item.id == req.params.id);
  //const child = result.children.find((item) => item.id == req.params.child);

  if (!req.params.id) {
    return res.render("../views/pages/404", {
      msg: "Employee was not deleted.",
      body: "Please pprovide the correct ID",
      user: req.user,
    });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  const deletedChild = employee.children.id(req.params.child);
  deletedChild.deleteOne();
  const result = await employee.save();

  const allEmployees = await Employee.find();

  if (!allEmployees) {
    return res.render("../views/pages/employees", {
      msg: "There are no employees created yet. Click on create employee.",
      body: "",
      data: "",
      user: req.user,
    });
  }

  res.render("../views/pages/employees", {
    msg: `Child ${deletedChild.childName} ${deletedChild.childSurname} of the employee ${result.firstName} ${result.lastName} was deleted.`,
    body: "Clicking OK you may proceed",
    data: allEmployees,
    user: req.user,
  });
};

//ALL UPDATES

//DONE
const updateEmployeePersonal = async (req, res) => {
  if (!req.params.id) {
    return res.render("../views/pages/404", {
      msg: "Id parameter is rewuired",
      body: "",
      user: req.user,
    });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res.render("../views/pages/404", {
      msg: "No employee found.",
      body: "Please provide the correct ID.",
      user: req.user,
    });
  }

  if (!req.body.employeeState) {
    employee.employeeState = false;
  } else {
    employee.employeeState = true;
  }
  if (req.body.personalNumber)
    employee.personalNumber = req.body.personalNumber;
  if (req.body.firstName) employee.firstName = req.body.firstName;
  if (req.body.lastName) employee.lastName = req.body.lastName;
  if (req.body.gender) employee.gender = req.body.gender;
  if (req.body.birthDate) employee.birthDate = req.body.birthDate;
  if (req.body.birthPlace) employee.birthPlace = req.body.birthPlace;
  if (req.body.socialSecNumber)
    employee.socialSecNumber = req.body.socialSecNumber;
  if (req.body.idCardNumber) employee.idCardNumber = req.body.idCardNumber;
  if (req.body.country) employee.country = req.body.country;
  if (req.body.nationality) employee.nationality = req.body.nationality;
  if (req.body.maritalStatus) employee.maritalStatus = req.body.maritalStatus;

  const result = await employee.save();

  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Personal data was updated successfully.`,
      body: `${result.firstName} ${result.lastName}`,
      data: result,
      user: req.user,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "Personal data was not updated.",
      body: "",
      user: req.user,
    });
  }
};

//DONE
const updateEmployeeContact = async (req, res) => {
  if (!req.params.id) {
    return res.render("../views/pages/404", {
      msg: "Id parameter is rewuired",
      body: "",
      user: req.user,
    });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res.render("../views/pages/404", {
      msg: "No employee found.",
      body: "Please provide the correct ID.",
      user: req.user,
    });
  }

  if (req.body.landLinePhone) employee.landLinePhone = req.body.landLinePhone;
  if (req.body.mobilePhone) employee.mobilePhone = req.body.mobilePhone;
  if (req.body.email) employee.email = req.body.email;
  if (req.body.password) employee.password = req.body.password;
  if (req.body.street) employee.street = req.body.street;
  if (req.body.houseNumber) employee.houseNumber = req.body.houseNumber;
  if (req.body.city) employee.city = req.body.city;
  if (req.body.postalCode) employee.postalCode = req.body.postalCode;

  const result = await employee.save();

  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Contacts data was updated successfully.`,
      body: `${result.firstName} ${result.lastName}`,
      data: result,
      user: req.user,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "Personal data was not updated.",
      body: "",
      user: req.user,
    });
  }
};

//DONE
const updateEmployeeSpouse = async (req, res) => {
  if (!req.params.id) {
    return res.render("../views/pages/404", {
      msg: "Id parameter is rewuired",
      body: "",
      user: req.user,
    });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res.render("../views/pages/404", {
      msg: "No employee found.",
      body: "Please provide the correct ID.",
      user: req.user,
    });
  }

  if (req.body.spouseName) employee.spouseName = req.body.spouseName;
  if (req.body.spouseSurname) employee.spouseSurname = req.body.spouseSurname;
  if (req.body.spouseDateOfBirth)
    employee.spouseDateOfBirth = req.body.spouseDateOfBirth;
  if (req.body.spouseSocialSecNumber)
    employee.spouseSocialSecNumber = req.body.spouseSocialSecNumber;

  const result = await employee.save();

  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Spouse ${result.spouseName} ${result.spouseSurname} data was updated successfully.`,
      body: `${result.firstName} ${result.lastName}`,
      data: result,
      user: req.user,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "Personal data was not updated.",
      body: "",
      user: req.user,
    });
  }
};

//DONE
const updateEmployeeHealth = async (req, res) => {
  if (!req.params.id) {
    return res.render("../views/pages/404", {
      msg: "Id parameter is rewuired",
      body: "",
      user: req.user,
    });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res.render("../views/pages/404", {
      msg: "No employee found.",
      body: "Please provide the correct ID.",
      user: req.user,
    });
  }

  if (req.body.publicHealthInsuranceName)
    employee.publicHealthInsuranceName = req.body.publicHealthInsuranceName;
  if (req.body.gastroHealthCard)
    employee.gastroHealthCard = req.body.gastroHealthCard;

  const result = await employee.save();

  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Health card ${result.publicHealthInsuranceName} was updated successfully.`,
      body: `${result.firstName} ${result.lastName}`,
      data: result,
      user: req.user,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "Personal data was not updated.",
      body: "",
      user: req.user,
    });
  }
};

//DONE
const updateEmployeeBank = async (req, res) => {
  if (!req.params.id) {
    return res.render("../views/pages/404", {
      msg: "Id parameter is rewuired",
      body: "",
      user: req.user,
    });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res.render("../views/pages/404", {
      msg: "No employee found.",
      body: "Please provide the correct ID.",
      user: req.user,
    });
  }

  if (req.body.bankName) employee.bankName = req.body.bankName;
  if (req.body.accountNumber) employee.accountNumber = req.body.accountNumber;
  if (req.body.bankCode) employee.bankCode = req.body.bankCode;
  const result = await employee.save();

  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Bank account ${result.accountNumber} was updated successfully.`,
      body: `${result.firstName} ${result.lastName}`,
      data: result,
      user: req.user,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "Personal data was not updated.",
      body: "",
      user: req.user,
    });
  }
};

//DONE
const updateEmployeeContract = async (req, res) => {
  if (!req.params.id) {
    return res.render("../views/pages/404", {
      msg: "Id parameter is rewuired",
      body: "",
      user: req.user,
    });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res.render("../views/pages/404", {
      msg: "No employee found.",
      body: "Please provide the correct ID.",
      user: req.user,
    });
  }

  if (req.body.contractStartDate)
    employee.contractStartDate = req.body.contractStartDate;
  if (req.body.contractEndDate)
    employee.contractEndDate = req.body.contractEndDate;
  if (req.body.contractSalaryType)
    employee.contractSalaryType = req.body.contractSalaryType;
  if (req.body.contractSalary)
    employee.contractSalary = req.body.contractSalary;
  if (req.body.contractType) employee.contractType = req.body.contractType;
  if (req.body.contractWeeklyHours)
    employee.contractWeeklyHours = req.body.contractWeeklyHours;

  const result = await employee.save();

  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Contract data for ${result.firstName} ${result.lastName} was updated successfully.`,
      body: `Contract Type: ${result.contractType} with ${result.contractSalaryType} rate/salary ${result.contractSalary}`,
      data: result,
      user: req.user,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "Personal data was not updated.",
      body: "",
      user: req.user,
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployee,
  deleteEmployee,
  createEmployee,
  updateEmployeePersonal,
  updateEmployeeContact,
  createChild,
  deleteChild,
  updateEmployeeSpouse,
  updateEmployeeHealth,
  updateEmployeeBank,
  updateEmployeeContract,
};
