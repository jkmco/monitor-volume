// modules
const express = require("express");
const app = express();
const cors = require("cors");

// dotenv config
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || "mongodb://localhost/your_db_name";
const API_URI = process.env.API_URI || "http://localhost:3000";

// middleware
app.use(cors());
app.use(express.json());

// route
const appConfig = require("./routes/AppConfig.route");
app.use("/app/config", appConfig);

// startup
require("./startup/db")(DB_URI);

// main
const { generateVolumeAlert } = require("./services/generateVolumeAlert");
const { getAppConfigValue } = require("./services/appConfigService");
const cron = require("node-cron");

const symbolList = require("./services/getSymbolList");

async function init() {
  console.log(">> monitor-volume initiailize >>");

  // load symbol list
  console.log(">> loading symbol list >>");

  if (!symbolList) {
    console.log(">> load symbol list failed! Please check! >>");
    process.exit(1);
  }
  console.log(
    `>> symbol list loaded successfully! total ${symbolList.length} symbols >>`
  );

  // load app config
  console.log(">> loading app config >>");

  const interval = (await getAppConfigValue("monitor-volume-interval")) || "1m";
  const limit = (await getAppConfigValue("monitor-volume-limit")) || 32;
  const percentage =
    (await getAppConfigValue("monitor-volume-percentage")) || 50;

  console.log(
    `>> app config loaded! interval ${interval} / limit ${limit} / % ${percentage}  >>`
  );

  // start to run

  console.log(
    `>> start to run the generateVolumeAlert! with interval ${interval} / limit ${limit} / % ${percentage} >>`
  );

  cron.schedule("3 * * * * *", async () => {
    await console.log(">> start to get volume every minute...");
    for (i in symbolList) {
      await generateVolumeAlert(
        symbolList[i].symbol,
        interval,
        parseInt(limit),
        parseInt(percentage)
      ); // alert when have 50x volume occur
    }
    await console.log(">> finished getting volume!");
  });
}

init();

// listen to server
app.listen(PORT, () => {
  console.log(`Server connected. Listening Port ${PORT}...`);
});
``;
