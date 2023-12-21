const express = require("express");
const router = express.Router();
const {employeeRecord} = require('../definitions/employee-record');
const  { pdfRead } = require("../middleware/readPdfHandler");
const {contract} = require('../definitions/contract');
const {liability} = require('../definitions/liability');
const {uniform} = require('../definitions/uniform');
const { medical } = require("../definitions/medical");
const { health } = require("../definitions/health");
const { gdpr } = require("../definitions/gdpr");
const { payslip } = require("../definitions/payslip");


router.get("/personal-data/:id", employeeRecord, pdfRead('personal data'));
router.get("/contract/:id", contract, pdfRead('contract'));
router.get("/liability/:id", liability, pdfRead('liability'));
router.get("/uniform/:id", uniform, pdfRead('uniform'));
router.get("/medical/:id", medical, pdfRead('medical'));
router.get("/health/:id", health, pdfRead('health'));
router.get("/gdpr/:id", gdpr, pdfRead('gdpr'));
router.get("/payslip/:id", payslip, pdfRead('payslip'));

module.exports = router;
