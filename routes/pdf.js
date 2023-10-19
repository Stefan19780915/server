const express = require("express");
const router = express.Router();
const {employeeRecord} = require('../definitions/employee-record');


router.get("/personal-data/:id", employeeRecord);

module.exports = router;
