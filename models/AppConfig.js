const mongoose = require("mongoose");

const AppConfig = mongoose.model(
  "AppConfig",
  new mongoose.Schema({
    key: String,
    value: String,
    updatedAt: Date,
  })
);

module.exports = AppConfig;
