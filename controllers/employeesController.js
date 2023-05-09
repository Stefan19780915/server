const Employee = require("../model/Employee");
const moment = require("moment");
moment.locale("en");

const data = {
  employees: require(".././model/employees.json"),
  setEmployees: function (data) {
    this.setEmployees = data;
  },
};

//DONE
const getAllEmployees = async (req, res) => {
  console.log(req.query);
  const allEmployees = await Employee.find();

  const birthDate = moment(allEmployees.birthDate).format();
  const formatedDate = `${birthDate.split("T")[0]}`;
  console.log(formatedDate);
  res.render("../views/pages/employees", {
    msg: false,
    data: allEmployees,
  });
};

//DONE
const getEmployee = async (req, res) => {
  const result = data.employees.find((item) => item.id == req.params.id);
  const oneEmployee = await Employee.findOne({ _id: req.params.id });
  if (oneEmployee != undefined) {
    res.render("../views/pages/employee", {
      msg: false,
      data: oneEmployee,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
    });
  }
};

const createEmployee = async (req, res) => {
  const newEmployee = {
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

  if (
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
    });
  }

  const result = await Employee.create(newEmployee);

  const allEmployees = await Employee.find();

  const unsortedArray = [...data.employees, newEmployee];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  console.log(result);

  res.render("../views/pages/employees", {
    msg: "Personal data of the employee was saved",
    body: "",
    data: allEmployees,
  });
};

//DONE
const deleteEmployee = (req, res) => {
  const result = data.employees.find((item) => item.id == req.params.id);
  if (!result) {
    return res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
    });
  }
  const filtereddArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.params.id)
  );

  data.setEmployees(
    filtereddArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  console.log(
    filtereddArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Personal data of employee ${result.firstName} ${result.lastName} was DELETED.`,
      body: "",
      data: result,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
    });
  }
};

//DONE
const createChild = (req, res) => {
  const result = data.employees.find((item) => item.id == req.params.id);
  const newChild = {
    id: result.children[result.children.length - 1].id
      ? result.children[result.children.length - 1].id + 1 || 1
      : 1,
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
    });
  }

  const newChildren = [...result.children, newChild];

  result.children = newChildren;

  const filtereddArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );

  const unsortedArray = [...filtereddArray, result];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  console.log(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  res.status(201).render("../views/pages/employees", {
    msg: `Child data ${req.body.childName} ${req.body.childSurname} of employee ${result.firstName} ${result.lastName} was added`,
    body: "",
    data: data.employees,
  });
};

//DONE
const deleteChild = (req, res) => {
  const result = data.employees.find((item) => item.id == req.params.id);
  const child = result.children.find((item) => item.id == req.params.child);

  const children = result.children.filter(
    (child) => child.id !== parseInt(req.params.child)
  );

  result.children = children;

  const filtereddArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.params.id)
  );

  const unsortedArray = [...filtereddArray, result];

  console.log(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Child ${child.childName} ${child.childSurname} data of employee ${result.firstName} ${result.lastName} was DELETED.`,
      body: "",
      data: result,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
    });
  }
};

//ALL UPDATES

//DONE
const updateEmployeePersonal = (req, res) => {
  const result = data.employees.find((item) => item.id == req.params.id);

  if (!result) {
    return res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
    });
  }

  if (req.body.firstName) result.firstName = req.body.firstName;
  if (req.body.lastName) result.lastName = req.body.lastName;
  if (req.body.gender) result.gender = req.body.gender;
  if (req.body.birthDate) result.birthDate = req.body.birthDate;
  if (req.body.birthPlace) result.birthPlace = req.body.birthPlace;
  if (req.body.socislSecNumber)
    result.socislSecNumber = req.body.socislSecNumber;
  if (req.body.idCardNumber) result.idCardNumber = req.body.idCardNumber;
  if (req.body.country) result.country = req.body.country;
  if (req.body.nationality) result.nationality = req.body.nationality;
  if (req.body.maritalStatus) result.maritalStatus = req.body.maritalStatus;

  const filtereddArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );

  const unsortedArray = [...filtereddArray, result];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  console.log(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Personal data of employee ${result.firstName} ${result.lastName} was UPDATED.`,
      body: "",
      data: result,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
    });
  }
};

const updateEmployeeContact = (req, res) => {
  console.log(req.params.id, req.body);
  const result = data.employees.find((item) => item.id == req.params.id);
  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Contact data of employee ${result.firstName} ${result.lastName} was UPDATED.`,
      body: "",
      data: result,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
    });
  }
};

const updateEmployeeSpouse = (req, res) => {
  console.log(req.params.id, req.body);
  const result = data.employees.find((item) => item.id == req.params.id);
  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Spouse data of employee ${result.firstName} ${result.lastName} was UPDATED.`,
      body: "",
      data: result,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
    });
  }
};

const updateEmployeeHealth = (req, res) => {
  console.log(req.params.id, req.body);
  const result = data.employees.find((item) => item.id == req.params.id);
  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Public Helath Authority of employee ${result.firstName} ${result.lastName} was UPDATED.`,
      body: "",
      data: result,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
    });
  }
};

const updateEmployeeBank = (req, res) => {
  console.log(req.params.id, req.body);
  const result = data.employees.find((item) => item.id == req.params.id);
  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Bank contact date of employee ${result.firstName} ${result.lastName} was UPDATED.`,
      body: "",
      data: result,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
    });
  }
};

const updateEmployeeContract = (req, res) => {
  console.log(req.params.id, req.body);
  const result = data.employees.find((item) => item.id == req.params.id);
  if (result != undefined) {
    res.render("../views/pages/employee", {
      msg: `Contract deatails of employee ${result.firstName} ${result.lastName} was UPDATED.`,
      body: "",
      data: result,
    });
  } else {
    res.render("../views/pages/404", {
      msg: "User not found",
      body: "",
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
