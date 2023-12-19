const express = require("express");
const router = express.Router();
const {employeeRecord} = require('../definitions/employee-record');
const {contract} = require('../definitions/contract');
const {liability} = require('../definitions/liability');
const {uniform} = require('../definitions/uniform');
const { medical } = require("../definitions/medical");
const { health } = require("../definitions/health");


router.get("/personal-data/:id", employeeRecord);
router.get("/contract/:id", contract);
router.get("/liability/:id", liability);
router.get("/uniform/:id", uniform);
router.get("/medical/:id", medical);
router.get("/health/:id", health);

module.exports = router;
