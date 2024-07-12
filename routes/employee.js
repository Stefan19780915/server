const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeesController");
const contractController = require("../controllers/contractController");
const { createUser } = require("../middleware/registerUserHandler");
const { deleteDir } = require('../middleware/deleteDirHandler');
const { dataCheck } = require('../middleware/dataCheck');

router.get("/", employeeController.getAllEmployees);

router.post("/", employeeController.getAllEmployees);

router.get("/:id", employeeController.getEmployee);

router.post("/personal", employeeController.createEmployee);

router.get("/personal/:id",  deleteDir, employeeController.deleteEmployee);

router.post("/child/:id", employeeController.createChild);

router.get("/child/:id/:child", employeeController.deleteChild);

router.put("/personal/:id", employeeController.updateEmployeePersonal);

router.put(
  "/contact/:id",
  createUser,
  employeeController.updateEmployeeContact
);

router.put("/spouse/:id", employeeController.updateEmployeeSpouse);

router.put("/health/:id", employeeController.updateEmployeeHealth);

router.put("/bank/:id", employeeController.updateEmployeeBank);

router.put("/school-employer/:id", employeeController.updateEmployeeSchool);

router.put("/employee-tax/:id", employeeController.updateTax);

//router.put("/contract/:id", employeeController.updateEmployeeContract);

router.get("/email/:id", dataCheck, employeeController.sendEmployeeEmail);


router.post("/position", employeeController.createPosition);
router.get("/position", employeeController.readPosition);
router.put("/position/:id", employeeController.updatePosition);
router.get("/position/:id", employeeController.deletePosition);


router.post("/company", employeeController.createCompany);
router.put("/company/:id", employeeController.updateCompany);
router.get("/company/:id", employeeController.deleteCompany);

router.post("/contract/:id", contractController.createContract);
router.put("/contract/:id", contractController.updateContract);
router.get('/contract/:id', contractController.deleteContract);

module.exports = router;
