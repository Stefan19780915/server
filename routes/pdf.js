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
const { zdep } = require("../definitions/zdep");
const { dataCheck } = require('../middleware/dataCheck');


router.get("/personal-data/:id", dataCheck, createDir, employeeRecord, pdfRead('personal data'));
router.get("/contract/:id", dataCheck, createDir, contract, pdfRead('contract'));
router.get("/liability/:id", dataCheck, createDir, liability, pdfRead('liability'));
router.get("/uniform/:id", dataCheck, createDir, uniform, pdfRead('uniform'));
router.get("/medical/:id", dataCheck, createDir, medical, pdfRead('medical'));
router.get("/health/:id", dataCheck, createDir, health, pdfRead('health'));
router.get("/gdpr/:id", dataCheck, createDir, gdpr, pdfRead('gdpr'));
router.get("/payslip/:id", dataCheck, createDir, payslip, pdfRead('payslip'));
router.get("/contract-end/:id", dataCheck, createDir, contractEnd, pdfRead('contract end'))
router.get("/contract-end-probation/:id", dataCheck, createDir, contractEndProbationPost, pdfRead('contract end probation post'))
router.get("/student/:id", dataCheck, createDir, student, pdfRead('student announcement'))
router.get("/nzdc/:id", dataCheck, createDir, nzdc, pdfRead('nzdc'));
router.get("/zdep/:id", dataCheck, createDir, zdep, pdfRead('zdep'));

module.exports = router;
