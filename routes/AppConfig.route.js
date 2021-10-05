const express = require("express");
const router = express.Router();
const {
  getAllAppConfig,
  getAppConfig,
  getAppConfigValue,
  saveAppConfig,
  deleteAppConfig,
} = require("../services/appConfigService");

// API
// get all
router.get("/", async (req, res) => {
  const result = await getAllAppConfig();
  res.json(result);
});

// get value by key
router.get("/:key", async (req, res) => {
  const result = await getAppConfigValue(req.params.key);
  res.json(result);
});

// create or update key value pair
router.post("/new", async (req, res) => {
  const result = await saveAppConfig(req.body.key, req.body.value);
  res.json(result);
});

// delete by key
router.delete("/delete", async (req, res) => {
  const result = await deleteAppConfig(req.body.key);
  res.json(result);
});

module.exports = router;
