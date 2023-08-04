const express = require("express");
const router = express.Router();
const { createPersonalData } = require("../controllers/pdfController");

router.get("/personal-data/:id", createPersonalData);

module.exports = router;
