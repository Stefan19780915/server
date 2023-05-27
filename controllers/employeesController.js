const User = require("../model/User");
const Employee = require("../model/Employee");
const Store = require("../model/Store");
const moment = require("moment");
moment.locale("en");

//DONE RENDER READ ALL EMPLOYEES
const getAllEmployees = async (req, res) => {
  const allStores =
    req.user.roles == "Admin"
      ? await Store.find().populate("user").sort({ storeName: "asc" })
      : req.user.roles == "Manager"
      ? await Store.findOne({ user: req.user._id })
      : [];

  const allUsers =
    req.user.roles == "Admin"
      ? await User.find().sort({ userName: "asc" })
      : req.user.roles == "Manager"
      ? await User.find({ store: allStores.id })
      : "";

  const allEmployees =
    req.user.roles == "Admin"
      ? await Employee.find().populate("store").sort({ lastName: "asc" })
      : req.user.roles == "Manager" && !allStores == []
      ? await Employee.find({ store: allStores._id })
          .populate("store")
          .sort({ lastName: "asc" })
      : [];

  if (allEmployees === []) {
    return res.render("../views/pages/employees", {
      msg: "There are no employees created yet or no store is assigned to this account.",
      data: "",
      users: req.user.roles == "Admin" ? allUsers : [],
      user: req.user,
      message: req.flash("message"),
    });
  }
  res.render("../views/pages/employees", {
    msg: false,
    data: allEmployees,
    user: req.user,
    users:
      req.user.roles == "Admin" || req.user.roles == "Manager" ? allUsers : [],
    managers:
      req.user.roles == "Admin"
        ? allUsers.filter((user) => user.active && user.roles == "Manager")
        : [],
    stores: allStores == null ? [] : allStores,
    message: req.flash("message"),
  });
};

//DONE RENDER READ ONE EMPLOYEE
const getEmployee = async (req, res) => {
  if (!req.params.id) {
    return res.render("../views/pages/404", {
      msg: "Employee was not found.",
      body: "Please pprovide the correct ID",
      user: req.user,
    });
  }

  const allStores =
    req.user.roles == "Admin"
      ? await Store.find().populate("user").sort({ storeName: "asc" })
      : [];

  const oneEmployee = await Employee.findOne({ _id: req.params.id }).populate(
    "store"
  );
  if (oneEmployee != undefined) {
    res.render("../views/pages/employee", {
      msg: false,
      data: oneEmployee,
      user: req.user,
      message: req.flash("message"),
      stores: allStores,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
      user: req.user,
    });
  }
};

// CREATE EMPLOYEE AND REDIRECT TO EMPLOYEE ROUTE
const createEmployee = async (req, res) => {
  const newEmployee = {
    store: req.body.store,
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
    !newEmployee.store ||
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
    req.flash("message", "All fields are required.");
    res.redirect("/employee");
  }

  try {
    const result = await Employee.create(newEmployee);
    req.flash(
      "message",
      `Employee ${result.firstName} ${result.lastName} was created successfully.`
    );
    res.redirect("/employee");
  } catch (err) {
    console.log(err);
  }
};

// DELETE EMPLOYEE AND REDIRECT TO EMPLOYEE ROUTE
const deleteEmployee = async (req, res) => {
  if (!req.params.id) {
    return res.render("../views/pages/404", {
      msg: "Employee was not deleted.",
      body: "Please pprovide the correct ID",
      user: req.user,
      message: req.flash("message"),
    });
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    req.flash("message", "Please provide the correct ID.");
    return res.redirect("/pages/404");
  }
  const result = await employee.deleteOne({ _id: req.params.id });
  req.flash(
    "message",
    `Personal data of ${result.firstName} ${result.lastName} was deleted.`
  );
  res.redirect("/employee");
};

// CREATE CHILD AND REDIRECT TO EMPLOYEE ROUTE
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
    req.flash("message", "All fields are required");
    return res.redirect("/employee");
  }

  try {
    const oneEmployee = await Employee.findOne({ _id: req.params.id });
    oneEmployee.children.push(newChild);
    await oneEmployee.save();

    req.flash(
      "message",
      `Child ${newChild.childName} ${newChild.childSurname} data was saved`
    );
    res.redirect("/employee");
  } catch (err) {
    console.log(err);
  }
};

// DELETE CHILD AND REDIRECT TO EMPLOYEE ROUTE
const deleteChild = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Child not found.");
    return res.redirect("/pages/404");
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  const deletedChild = employee.children.id(req.params.child);
  deletedChild.deleteOne();
  const result = await employee.save();
  req.flash(
    "message",
    `Child ${deletedChild.childName} ${deletedChild.childSurname} of the employee ${result.firstName} ${result.lastName} was deleted.`
  );
  res.redirect("/employee");
};

//ALL UPDATES
// UPDATE PERSONAL AND REDIRECT TO EMPLOYEE ROUTE
const updateEmployeePersonal = async (req, res) => {
  console.log(req.body);
  if (!req.params.id) {
    req.flash("message", "Id parameter is rewuired");
    return res.redirect("/pages/404");
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    req.flash("message", "No employee found.");
    return res.redirect("/pages/404");
  }

  if (req.body.store != 0) {
    employee.store = req.body.store;
  } else {
    employee.store;
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
    req.flash(
      "message",
      `Personal data of ${result.firstName} ${result.lastName} was updated successfully.`
    );
    res.redirect("/employee");
  } else {
    req.flash("message", "Personal data eas not updated.");
    return res.redirect("/pages/404");
  }
};

// UPDATE CONTACT AND REDIRECT TO EMPLOYEE ROUTE
const updateEmployeeContact = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Id parameter is rewuired");
    return res.redirect("/pages/404");
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    req.flash("message", "No employee found.");
    return res.redirect("/pages/404");
  }

  //HERE WE SHOULD ALSO REGISTER THE EMPLOYEE AS USER AND SEND AN EMAIL TO THE USERS EMAIL WITH THE LINK.

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
    req.flash(
      "message",
      `Contacts data of ${result.firstName} ${result.lastName} was updated successfully.`
    );
    res.redirect("/employee");
  } else {
    req.flash("message", "Contact data was not updated..");
    return res.redirect("/pages/404");
  }
};

// UPDATE SPOUSE AND REDIRECT TO EMPLOYEE ROUTE
const updateEmployeeSpouse = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Id parameter is rewuired");
    return res.redirect("/pages/404");
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    req.flash("message", "No employee found.");
    return res.redirect("/pages/404");
  }

  if (req.body.spouseName) employee.spouseName = req.body.spouseName;
  if (req.body.spouseSurname) employee.spouseSurname = req.body.spouseSurname;
  if (req.body.spouseDateOfBirth)
    employee.spouseDateOfBirth = req.body.spouseDateOfBirth;
  if (req.body.spouseSocialSecNumber)
    employee.spouseSocialSecNumber = req.body.spouseSocialSecNumber;

  const result = await employee.save();

  if (result != undefined) {
    req.flash(
      "message",
      `Spouse ${result.spouseName} ${result.spouseSurname} data was updated successfully.`
    );
    res.redirect("/employee");
  } else {
    req.flash("message", "Spouse data was not updated..");
    return res.redirect("/pages/404");
  }
};

// UPDATE HEALTH AND REDIRECT TO EMPLOYEE ROUTE
const updateEmployeeHealth = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Id parameter is rewuired");
    return res.redirect("/pages/404");
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    req.flash("message", "No employee found.");
    return res.redirect("/pages/404");
  }

  if (req.body.publicHealthInsuranceName)
    employee.publicHealthInsuranceName = req.body.publicHealthInsuranceName;
  if (req.body.gastroHealthCard)
    employee.gastroHealthCard = req.body.gastroHealthCard;

  const result = await employee.save();

  if (result != undefined) {
    req.flash(
      "message",
      `Health card ${result.publicHealthInsuranceName} was updated successfully.`
    );
    res.redirect("/employee");
  } else {
    req.flash("message", "Health data was not updated..");
    return res.redirect("/pages/404");
  }
};

// UPDATE BANK AND REDIRECT TO EMPLOYEE ROUTE
const updateEmployeeBank = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Id parameter is rewuired");
    return res.redirect("/pages/404");
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    req.flash("message", "No employee found.");
    return res.redirect("/pages/404");
  }

  if (req.body.bankName) employee.bankName = req.body.bankName;
  if (req.body.accountNumber) employee.accountNumber = req.body.accountNumber;
  if (req.body.bankCode) employee.bankCode = req.body.bankCode;
  const result = await employee.save();

  if (result != undefined) {
    req.flash(
      "message",
      `Bank account ${result.accountNumber} was updated successfully.`
    );
    res.redirect("/pages/employee");
  } else {
    req.flash("message", "Bank account data was not updated..");
    return res.redirect("/pages/404");
  }
};

// UPDATE CONTRACT AND REDIRECT TO EMPLOYEE ROUTE
const updateEmployeeContract = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Id parameter is rewuired");
    return res.redirect("/pages/404");
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    req.flash("message", "No employee found.");
    return res.redirect("/pages/404");
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
    req.flash(
      "message",
      `Contract data for ${result.firstName} ${result.lastName} was updated successfully.`
    );
    res.redirect("/employee");
  } else {
    req.flash("message", "Contract data was not updated..");
    return res.redirect("/pages/404");
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
