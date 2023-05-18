const express = require("express");
const router = express.Router();
const storesController = require("../controllers/storesController");

router.post("/", storesController.createStore);
router.put("/", storesController.updateStore);
router.delete("/", storesController.deleteStore);

module.exports = router;
