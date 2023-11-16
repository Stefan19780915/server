const User = require("../model/User");
const Employee = require("../model/Employee");
const Position = require("../model/Positions");
const Company = require("../model/Company");
const Store = require("../model/Store");
const Token = require("../model/token");
const moment = require("moment");
moment.locale("sk");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");
const { zhCN } = require("date-fns/locale");
const sendEmail = require("../utils/sendEmployeeEmail");

//DONE RENDER READ ALL EMPLOYEES
const getAllEmployees = async (req, res) => {
  const allStores =
    req.user.roles == "Admin"
      ? await Store.find({ admin: req.user.id })
          .populate("user").populate('storeCompany')
          .sort({ storeName: "asc" })
      : req.user.roles == "Manager"
      ? await Store.findOne({ user: req.user.id })
      : req.user.roles == "Owner"
      ? await Store.find().populate("user").populate('storeCompany').sort({ storeName: "asc" })
      : [];

  const allPositions = await Position.find().populate('admin');

  const companies = await Company.find();
  const adminCompanies = await Company.find({ admin: req.user.id })

  const allUsers =
    req.user.roles == "Admin"
      ? (await User.find().sort({ userName: "asc" })).filter(
          (user) => user.admin == req.user.id || user.id == req.user.id
        )
      : req.user.roles == "Manager"
      ? await User.find({ store: allStores ? allStores.id : [] })
      : req.user.roles == "Owner"
      ? await User.find().sort({ userName: "asc" })
      : [];

  const allEmployees =
    req.user.roles == "Admin" || req.user.roles == "Owner"
      ? await Employee.find().populate("store").sort({ lastName: "asc" })
      : req.user.roles == "Manager" && !allStores == []
      ? await Employee.find({ store: allStores._id })
          .populate("store")
          .sort({ lastName: "asc" })
      : [];

  const adminEmployees = allEmployees.filter(
    (emp) => emp.store.admin == req.user.id
  );


  if (allEmployees == []) {
    return res.render("../views/pages/employees", {
      msg: "There are no employees created yet or no store is assigned to this account.",
      data: "",
      users:
        req.user.roles == "Admin" || req.user.roles == "Owner" ? allUsers : [],
      user: req.user,
      message: req.flash("message"),
    });
  }
  res.render("../views/pages/employees", {
    msg: false,
    data:
      req.user.roles == "Owner" || req.user.roles == "Manager"
        ? allEmployees
        : adminEmployees,
    user: req.user,
    users:
      req.user.roles == "Admin" ||
      req.user.roles == "Manager" ||
      req.user.roles == "Owner"
        ? allUsers
        : [],
    managers:
      req.user.roles == "Admin" || req.user.roles == "Owner"
        ? allUsers.filter(
            (user) =>
              (user.active && user.roles == "Manager") || user.roles == "Admin"
          )
        : [],
    stores: allStores == null ? "" : allStores,
    positions: allPositions,
    companies: req.user.roles == 'Owner' ? companies : adminCompanies,
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
      ? await Store.find({ admin: req.user.id })
          .populate("user")
          .sort({ storeName: "asc" })
      : [];

  const allPositions = await Position.find().populate('admin');

  const oneEmployee = await Employee.findOne({ _id: req.params.id }).populate("store").populate("position");

  if (oneEmployee != undefined) {
    res.render("../views/pages/employee", {
      msg: false,
      data: oneEmployee,
      user: req.user,
      message: req.flash("message"),
      stores: allStores,
      positions: allPositions,
      position: oneEmployee.position ? oneEmployee.position.position : "No position"
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
      user: req.user
    });
  }
};

// CREATE EMPLOYEE AND REDIRECT TO EMPLOYEE ROUTE
const createEmployee = async (req, res) => {
  const newEmployee = {
    employeeState: req.body.employeeState,
    store: req.body.store,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthName: req.body.birthName,
    email: req.body.email,
    password: req.body.password,
  };

  if (newEmployee.employeeState == "on") {
    newEmployee.employeeState = true;
  } else if (!newEmployee.employeeState) {
    newEmployee.employeeState = false;
  } else {
    return;
  }

  if (newEmployee.store == 0) {
    req.flash("message", "Please assigne a store to the employee.");
    return res.redirect("/employee");
  }

  if (
    !newEmployee.store ||
    !newEmployee.email ||
    !newEmployee.password ||
    !newEmployee.firstName ||
    !newEmployee.lastName
  ) {
    req.flash("message", "All fields are required.");
    return res.redirect("/employee");
  }

  //CHECK WHO IS CREATING THE EMPLOYEE

  const admin =
    req.user.roles == "Admin" || req.user.roles == "Owner"
      ? req.user.id
      : req.user.admin;

  const duplicateUser = await User.findOne({ userEmail: newEmployee.email });

  if (duplicateUser) {
    req.flash("message", "User already exists with provided email.");
    return res.redirect("/employee");
  }

  try {
    const result = await Employee.create(newEmployee);
    const hashedPassword = await bcrypt.hash(newEmployee.password, 10);
    const newUser = {
      admin: admin,
      store: result.store,
      employee: result._id,
      userName: `${result.firstName} ${result.lastName}`,
      userEmail: result.email,
      password: hashedPassword,
    };

    const resultUser = await User.create(newUser);

    // CREATE THE TOKEN HERE
    const token = {
      userID: resultUser.id,
      token: crypto.randomBytes(32).toString("hex"),
    };

    const resultToken = await Token.create(token);

    //SEND THE EMAIL VERIFICATION LINK

    const link = `${process.env.BASE_URL}/verify/${resultUser.id}/${resultToken.token}`;

    const html = `
    <h1>Hello</h1>
      <p>Please click on the link below, and verify your email account.</p>
      <a href="${link}">${link}</a>
      <p>Your temporary login password is: ${newEmployee.password}</p>
      `;

    const info = await sendEmail(
      resultUser.userEmail,
      [],
      "Please verify your email",
      html
    );

    console.log(info);

    req.flash(
      "message",
      `Employee and user ${resultUser.userName} with email: ${result.email} was created successfully.
      Email verification link was sent to ${resultUser.userEmail}`
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

  console.log(employee.store);

  if (req.body.store && req.body.store != 0) {
    employee.store = req.body.store;
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
  if (req.body.birthName) employee.birthName = req.body.birthName;
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
    req.flash("message", "Id parameter is required");
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
  if (req.body.streetTemp) employee.streetTemp = req.body.streetTemp;
  if (req.body.houseNumberTemp) employee.houseNumberTemp = req.body.houseNumberTemp;
  if (req.body.cityTemp) employee.cityTemp = req.body.cityTemp;
  if (req.body.postalCodeTemp) employee.postalCodeTemp = req.body.postalCodeTemp;

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
    if (req.body.ztpDochodca)
    employee.ztpDochodca = req.body.ztpDochodca;

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
    res.redirect("/employee");
  } else {
    req.flash("message", "Bank account data was not updated..");
    return res.redirect("/pages/404");
  }
};


// UPDATE EPLOYEE SCHOOL OR ODTHER EPLOYER

const updateEmployeeSchool = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Id parameter is rewuired");
    return res.redirect("/pages/404");
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    req.flash("message", "No employee found.");
    return res.redirect("/pages/404");
  }

  if (req.body.schoolName) employee.schoolName = req.body.schoolName;
  if (req.body.employerName) employee.employerName = req.body.employerName;
  
  const result = await employee.save();

  if (result != undefined) {
    req.flash(
      "message",
      `School or Employer ${result.employerName, result.schoolName} was updated successfully.`
    );
    res.redirect("/employee");
  } else {
    req.flash("message", "School or Employer was not updated..");
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
    if (req.body.position != 0) {
      employee.position = req.body.position;
    } else {
      employee.position;
    }

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

//GET ONE EMPLYEE AND SEND EMAIL

const sendEmployeeEmail = async (req, res) => {
  const oneEmployee = await Employee.findOne({ _id: req.params.id }).populate(
    "store"
  );

  const userAdmin = req.user.admin
    ? await User.findOne({ _id: req.user.id }).populate("admin")
    : "";

  const userAdminEmail = !userAdmin
    ? req.user.userEmail
    : userAdmin.admin.userEmail;

  const html = `
      <h1>Hello</h1>
      <p>This is the body of the email.</p>
      <label>Personal number</label>
      <p>${oneEmployee.personalNumber}</p>
      <label>Name and Surname</label>
      <p>${oneEmployee.firstName} ${oneEmployee.lastName}</p>`;

  const subject = `Nástup - ${oneEmployee.lastName} ${oneEmployee.firstName} ${
    oneEmployee.store.storeName
  } ${oneEmployee.contractType} od: ${moment(
    oneEmployee.contractStartDate
  ).format("LL")}`;

  const info = await sendEmail(
    req.user.userEmail,
    [userAdminEmail, oneEmployee.store.storeEmail],
    subject,
    html
  );

  if (info.messageId) {
    console.log("Message sent");
    req.flash(
      "message",
      `Employee ${oneEmployee.firstName} ${oneEmployee.lastName} was sent via email id: ${info.messageId}.`
    );
    res.redirect("/employee");
  } else {
    console.log("Message was not sent");
    req.flash("message", `Employee was sent via email.`);
    res.redirect("/employee");
  }
};

// CRUD POSITION

const createPosition = async (req, res)=>{
  console.log(req.body);
  console.log(req.user._id);

  const newPosition = {
    position: req.body.position,
    admin: req.user._id
  };

  if (
    !newPosition.position ||
    !newPosition.admin
  ) {
    req.flash("message", "Please provide a position name.");
    return res.redirect("/employee");
  }

  try {
    const result = await Position.create(newPosition);

    req.flash(
      "message",
      `Position was created.`
    );
    res.redirect("/employee");
  } catch (err) {
    console.log(err);
  }
}

const readPosition = async (req, res)=>{

}

const updatePosition = async (req, res)=>{

}


const deletePosition = async (req, res)=>{
  
  const onePosition = await Position.findOne({ _id: req.params.id }).exec();

  if (!onePosition) {
    req.flash("message", "Please provide the correct ID.");
    return res.redirect("/pages/404");
  }
  const result = await Position.deleteOne({ _id: req.params.id });

  req.flash(
    "message",
    `Position was deleted.`
  );

  res.redirect("/employee");

}


// CRUD COMPANY


const createCompany = async (req, res)=>{
  console.log(req.body);
  console.log(req.user._id);

  const newCompany = {
    admin: req.user._id,
    companyName: req.body.companyName,
    companyStreet: req.body.companyStreet,
    companyStreetNumber: req.body.companyStreetNumber,
    companyCity: req.body.companyCity,
    companyCountry: req.body.companyCountry,
    companyBusinessRegister: req.body.companyBusinessRegister,
    companyTaxId: req.body.companyTaxId
  };

  if (
    !newCompany.companyName ||
    !newCompany.admin ||
    !newCompany.companyStreet ||
    !newCompany.companyStreetNumber ||
    !newCompany.companyCity ||
    !newCompany.companyCountry ||
    !newCompany.companyBusinessRegister ||
    !newCompany.companyTaxId
) {
    req.flash("message", "Please fill in all fields.");
    return res.redirect("/employee");
  }

  try {
    const result = await Company.create(newCompany);

    req.flash(
      "message",
      `Company was created.`
    );
    res.redirect("/employee");
  } catch (err) {
    console.log(err);
  }
}


const updateCompany = async (req, res) => {
  if (!req.params.id) {
    req.flash("message", "Id parameter is rewuired");
    return res.redirect("/pages/404");
  }
  const company = await Company.findOne({ _id: req.params.id }).exec();


  if (!company) {
    req.flash("message", "No employee found.");
    return res.redirect("/pages/404");
  }

  if (req.body.companyName) company.companyName = req.body.companyName;
  if (req.body.companyStreet) company.companyStreet = req.body.companyStreet;
  if (req.body.companyStreetNumber) company.companyStreetNumber= req.body.companyStreetNumber;
  if (req.body.companyCity) company.companyCity= req.body.companyCity;
  if (req.body.companyCountry) company.companyCountry= req.body.companyCountry;
  if (req.body.companyBusinessRegister) company.companyBusinessRegister= req.body.companyBusinessRegister;
  if (req.body.companyTaxId) company.companyTaxId= req.body.companyTaxId;

  

  const result = await company.save();

  console.log(result)

  if (result != undefined) {
    req.flash(
      "message",
      `Company ${result.companyName} was updated successfully.`
    );
    return res.redirect("/employee");
  } 
};

const deleteCompany = async (req, res)=>{
  
  const oneCompany = await Company.findOne({ _id: req.params.id }).exec();

  if (!oneCompany) {
    req.flash("message", "Please provide the correct ID.");
    return res.redirect("/pages/404");
  }
  const result = await Company.deleteOne({ _id: req.params.id });

  req.flash(
    "message",
    `Company was deleted.`
  );

  res.redirect("/employee");

}




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
  sendEmployeeEmail,
  updateEmployeeSchool,
  createPosition,
  readPosition,
  updatePosition,
  deletePosition,
  createCompany,
  updateCompany,
  deleteCompany
};
