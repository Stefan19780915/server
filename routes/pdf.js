const express = require("express");
const router = express.Router();
const {employeeRecord} = require('../definitions/employee-record');
const  { pdfRead } = require("../middleware/readPdfHandler");
const  { createDir } = require("../middleware/createDirHandler");
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
const { nzdc } = require("../definitions/nzdc");


router.get("/personal-data/:id", createDir, employeeRecord, pdfRead('personal data'));
router.get("/contract/:id", createDir, contract, pdfRead('contract'));
router.get("/liability/:id", createDir, liability, pdfRead('liability'));
router.get("/uniform/:id", createDir, uniform, pdfRead('uniform'));
router.get("/medical/:id", createDir, medical, pdfRead('medical'));
router.get("/health/:id", createDir, health, pdfRead('health'));
router.get("/gdpr/:id", createDir, gdpr, pdfRead('gdpr'));
router.get("/payslip/:id", createDir, payslip, pdfRead('payslip'));
router.get("/contract-end/:id", createDir, contractEnd, pdfRead('contract end'))
router.get("/contract-end-probation/:id", createDir, contractEndProbationPost, pdfRead('contract end probation post'))
router.get("/student/:id", createDir, student, pdfRead('student announcement'))
router.get("/nzdc/:id", createDir, nzdc, pdfRead('nzdc'))

module.exports = router;
