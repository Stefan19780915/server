const express = require("express");
const router = express.Router();
const {employeeRecord} = require('../definitions/employee-record');
const {contract} = require('../definitions/contract');
const {liability} = require('../definitions/liability');


router.get("/personal-data/:id", employeeRecord);
router.get("/contract/:id", contract);
router.get("/liability/:id", liability);

module.exports = router;
