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
const { contractEnd } = require("../definitions/contract-end");
const { contractEndProbationPost } = require("../definitions/contract-end-probation");
const { student } = require("../definitions/student");


router.get("/personal-data/:id", employeeRecord, pdfRead('personal data'));
router.get("/contract/:id", contract, pdfRead('contract'));
router.get("/liability/:id", liability, pdfRead('liability'));
router.get("/uniform/:id", uniform, pdfRead('uniform'));
router.get("/medical/:id", medical, pdfRead('medical'));
router.get("/health/:id", health, pdfRead('health'));
router.get("/gdpr/:id", gdpr, pdfRead('gdpr'));
router.get("/payslip/:id", payslip, pdfRead('payslip'));
router.get("/contract-end/:id", contractEnd, pdfRead('contract end'))
router.get("/contract-end-probation/:id", contractEndProbationPost, pdfRead('contract end probation post'))
router.get("/student/:id", student, pdfRead('student announcement'))

module.exports = router;
