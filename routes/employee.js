const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeesController");
const { createUser } = require("../middleware/registerUserHandler");

router.get("/", employeeController.getAllEmployees);

router.get("/:id", employeeController.getEmployee);

router.post("/personal", employeeController.createEmployee);

router.get("/personal/:id", employeeController.deleteEmployee);

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

router.put("/contract/:id", employeeController.updateEmployeeContract);

router.get("/email/:id", employeeController.sendEmployeeEmail);

module.exports = router;
