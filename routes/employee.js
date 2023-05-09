const express = require("express");
const router = express.Router();
const path = require("path");
const employeeController = require("../controllers/employeesController");
const data = {};
data.employees = require(".././model/employees.json");

router.get("/", employeeController.getAllEmployees);

router.get("/:id", employeeController.getEmployee);

router.post("/personal", employeeController.createEmployee);

router.get("/personal/:id", employeeController.deleteEmployee);

router.post("/child/:id", employeeController.createChild);

router.get("/child/:id/:child", employeeController.deleteChild);

router.put("/personal/:id", employeeController.updateEmployeePersonal);

router.put("/contact/:id", employeeController.updateEmployeeContact);

router.put("/spouse/:id", employeeController.updateEmployeeSpouse);

router.put("/health/:id", employeeController.updateEmployeeHealth);

router.put("/bank/:id", employeeController.updateEmployeeBank);

router.put("/contract/:id", employeeController.updateEmployeeContract);

module.exports = router;
