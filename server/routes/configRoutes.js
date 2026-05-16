const express = require("express");
const { getConfig, saveConfig } = require("../controllers/configController");

const router = express.Router();

router.get("/", getConfig);
router.post("/", saveConfig);

module.exports = router;
