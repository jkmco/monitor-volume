// modules
const express = require("express");
const app = express();
const cors = require("cors");

// dotenv config
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || "mongodb://localhost/your_db_name";

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
const cron = require("node-cron");

const getVolumeList = [
  { symbol: "BTCUSDT", base: "BTC" },
  { symbol: "ETHUSDT", base: "ETH" },
  { symbol: "BCHUSDT", base: "BCH" },
  { symbol: "XRPUSDT", base: "XRP" },
  { symbol: "EOSUSDT", base: "EOS" },
  { symbol: "LTCUSDT", base: "LTC" },
  { symbol: "TRXUSDT", base: "TRX" },
  { symbol: "ETCUSDT", base: "ETC" },
  { symbol: "LINKUSDT", base: "LINK" },
  { symbol: "XLMUSDT", base: "XLM" },
  { symbol: "ADAUSDT", base: "ADA" },
  { symbol: "XMRUSDT", base: "XMR" },
  { symbol: "DASHUSDT", base: "DASH" },
  { symbol: "ZECUSDT", base: "ZEC" },
  { symbol: "XTZUSDT", base: "XTZ" },
  { symbol: "BNBUSDT", base: "BNB" },
  { symbol: "ATOMUSDT", base: "ATOM" },
  { symbol: "ONTUSDT", base: "ONT" },
  { symbol: "IOTAUSDT", base: "IOTA" },
  { symbol: "BATUSDT", base: "BAT" },
  { symbol: "VETUSDT", base: "VET" },
  { symbol: "NEOUSDT", base: "NEO" },
  { symbol: "QTUMUSDT", base: "QTUM" },
  { symbol: "IOSTUSDT", base: "IOST" },
  { symbol: "THETAUSDT", base: "THETA" },
  { symbol: "ALGOUSDT", base: "ALGO" },
  { symbol: "ZILUSDT", base: "ZIL" },
  { symbol: "KNCUSDT", base: "KNC" },
  { symbol: "ZRXUSDT", base: "ZRX" },
  { symbol: "COMPUSDT", base: "COMP" },
  { symbol: "OMGUSDT", base: "OMG" },
  { symbol: "DOGEUSDT", base: "DOGE" },
  { symbol: "SXPUSDT", base: "SXP" },
  { symbol: "KAVAUSDT", base: "KAVA" },
  { symbol: "BANDUSDT", base: "BAND" },
  { symbol: "RLCUSDT", base: "RLC" },
  { symbol: "WAVESUSDT", base: "WAVES" },
  { symbol: "MKRUSDT", base: "MKR" },
  { symbol: "SNXUSDT", base: "SNX" },
  { symbol: "DOTUSDT", base: "DOT" },
  { symbol: "DEFIUSDT", base: "DEFI" },
  { symbol: "YFIUSDT", base: "YFI" },
  { symbol: "BALUSDT", base: "BAL" },
  { symbol: "CRVUSDT", base: "CRV" },
  { symbol: "TRBUSDT", base: "TRB" },
  { symbol: "YFIIUSDT", base: "YFII" },
  { symbol: "RUNEUSDT", base: "RUNE" },
  { symbol: "SUSHIUSDT", base: "SUSHI" },
  { symbol: "SRMUSDT", base: "SRM" },
  { symbol: "BZRXUSDT", base: "BZRX" },
  { symbol: "EGLDUSDT", base: "EGLD" },
  { symbol: "SOLUSDT", base: "SOL" },
  { symbol: "ICXUSDT", base: "ICX" },
  { symbol: "STORJUSDT", base: "STORJ" },
  { symbol: "BLZUSDT", base: "BLZ" },
  { symbol: "UNIUSDT", base: "UNI" },
  { symbol: "AVAXUSDT", base: "AVAX" },
  { symbol: "FTMUSDT", base: "FTM" },
  { symbol: "HNTUSDT", base: "HNT" },
  { symbol: "ENJUSDT", base: "ENJ" },
  { symbol: "FLMUSDT", base: "FLM" },
  { symbol: "TOMOUSDT", base: "TOMO" },
  { symbol: "RENUSDT", base: "REN" },
  { symbol: "KSMUSDT", base: "KSM" },
  { symbol: "NEARUSDT", base: "NEAR" },
  { symbol: "AAVEUSDT", base: "AAVE" },
  { symbol: "FILUSDT", base: "FIL" },
  { symbol: "RSRUSDT", base: "RSR" },
  { symbol: "LRCUSDT", base: "LRC" },
  { symbol: "MATICUSDT", base: "MATIC" },
  { symbol: "OCEANUSDT", base: "OCEAN" },
  { symbol: "CVCUSDT", base: "CVC" },
  { symbol: "BELUSDT", base: "BEL" },
  { symbol: "CTKUSDT", base: "CTK" },
  { symbol: "AXSUSDT", base: "AXS" },
  { symbol: "ALPHAUSDT", base: "ALPHA" },
  { symbol: "ZENUSDT", base: "ZEN" },
  { symbol: "SKLUSDT", base: "SKL" },
  { symbol: "GRTUSDT", base: "GRT" },
  { symbol: "1INCHUSDT", base: "1INCH" },
  { symbol: "CHZUSDT", base: "CHZ" },
  { symbol: "SANDUSDT", base: "SAND" },
  { symbol: "LUNAUSDT", base: "LUNA" },
  { symbol: "LITUSDT", base: "LIT" },
  { symbol: "BTCSTUSDT", base: "BTCST" },
  { symbol: "COTIUSDT", base: "COTI" },
  { symbol: "CHRUSDT", base: "CHR" },
  { symbol: "MANAUSDT", base: "MANA" },
  { symbol: "ALICEUSDT", base: "ALICE" },
  { symbol: "HBARUSDT", base: "HBAR" },
  { symbol: "ONEUSDT", base: "ONE" },
  { symbol: "LINAUSDT", base: "LINA" },
  { symbol: "CELRUSDT", base: "CELR" },
  { symbol: "SCUSDT", base: "SC" },
  { symbol: "1000SHIBUSDT", base: "1000SHIB" },
  { symbol: "ICPUSDT", base: "ICP" },
  { symbol: "BAKEUSDT", base: "BAKE" },
  { symbol: "KEEPUSDT", base: "KEEP" },
  { symbol: "IOTXUSDT", base: "IOTX" },
  { symbol: "AUDIOUSDT", base: "AUDIO" },
  { symbol: "RAYUSDT", base: "RAY" },
  { symbol: "C98USDT", base: "C98" },
  { symbol: "DYDXUSDT", base: "DYDX" },
];

(async () => {
  cron.schedule("3 * * * * *", async () => {
    await console.log(">> start to get volume every minute...");
    for (i in getVolumeList) {
      await generateVolumeAlert(getVolumeList[i].symbol, "1m", 32, 20); // alert when have 50x volume occur
    }
    await console.log(">> finished get volume!");
  });
})();

// listen to server
app.listen(PORT, () => {
  console.log(`Server connected. Listening Port ${PORT}...`);
});
``;
