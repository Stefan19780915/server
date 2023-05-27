const express = require("express");
const router = express.Router();
const storesController = require("../controllers/storesController");

router.post("/", storesController.createStore);
router.put("/:id", storesController.updateStore);
router.get("/:id", storesController.deleteStore);

module.exports = router;
