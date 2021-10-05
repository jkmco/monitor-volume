const AppConfig = require("../models/AppConfig");

////////////////////// usage //////////////////////////////////////////
// * getAppConfigValue(key) is for getting the value directly
// * saveAppConfig(key, value) is for setting/updating key-value pairs
// * all others are mainly used in api
/*
const {getAppConfigValue, saveAppConfig} = require("./services/appConfigService")
 */
//////////////////////////////////////////////////////////////////////

function getAllAppConfig() {
  return AppConfig.find()
    .select({ _id: 0 })
    .then((result) => {
      return { status: "success", total: result.length, data: result };
    })
    .catch((error) => {
      return { error: error };
    });
}

function getAppConfig(key) {
  if (!key) return { status: "failed", message: "Please check it again!" };

  return AppConfig.find({ key: key })
    .select({ _id: 0 })
    .then((result) => {
      return { status: "success", data: result, value: result[0].value };
    })
    .catch((error) => {
      return { status: "fail", error: error };
    });
}

async function getAppConfigValue(key) {
  try {
    const result = await getAppConfig(key);
    return result.value;
  } catch (error) {
    return { status: "fail", error: error };
  }
}

function saveAppConfig(key, value) {
  if (!key || !value)
    return { status: "failed", message: "Please check it again!" };

  return AppConfig.updateOne(
    { key: key },
    { $set: { value: value }, $currentDate: { updatedAt: true } },
    { upsert: true }
  )
    .then(() => {
      return {
        status: "success",
        message: `AppConfig : ${key} saved to ${value} successfully!`,
      };
    })
    .catch((error) => {
      return { status: "fail", error: error };
    });
}

function deleteAppConfig(key) {
  if (!key) return { status: "fail", message: "Please check it again!" };

  return AppConfig.deleteMany({ key: key })
    .then(() => {
      return {
        status: "success",
        message: `AppConfig : ${key} deleted successfully!`,
      };
    })
    .catch((error) => {
      return { error: error };
    });
}

module.exports = {
  getAllAppConfig,
  getAppConfig,
  saveAppConfig,
  deleteAppConfig,
  getAppConfigValue,
};
