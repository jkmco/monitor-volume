const { binanceusdm } = require("./connectExchange");
const { bot } = require("./connectTelegram");
const VolumeAlert = require("../models/VolumeAlert");

////////////////////// usage //////////////////////////////////////////
// * it's monitoring binanceusdmm exchange volume only
// * getVolume() is for getting total+latest+now+average volume and close price
// * generateVolumeAlert() will send message to telegram after certain criterion
/*
const { generateVolumeAlert } = require("./services/generateVolumeAlert");
(async () => {
  await generateVolumeAlert("BTCUSDT", "1m", 32, 50);
})();
 */
//////////////////////////////////////////////////////////////////////

async function getVolume(symbol, interval, limit, percentage) {
  try {
    const result = await binanceusdm.fapiPublicGetKlines({
      symbol: symbol,
      interval: interval,
      limit: limit,
    });

    let totalVolume = 0;
    let latestVolume = 0;
    let nowVolume = 0;
    let closePrice = 0;

    for (i in result) {
      closePrice = parseFloat(result[i][4]);
      i == result.length - 1
        ? (nowVolume += parseFloat(result[i][5]))
        : i == result.length - 2
        ? (latestVolume += parseFloat(result[i][5]))
        : (totalVolume += parseFloat(result[i][5]));
    }

    const averageVolume = totalVolume / limit;

    // console.log(
    //   `${symbol} @ ${closePrice} || total: ${totalVolume} average: ${averageVolume} latest: ${latestVolume}`
    // );
    return { totalVolume, latestVolume, averageVolume, closePrice };
  } catch (error) {
    console.log("!!!!!!!!!!!!!! ERROR !!!!!!!!!!!!!!!!!", error);
  }
}

async function getBTCVolume(interval, limit, percentage) {
  const { totalVolume, latestVolume, averageVolume, closePrice } =
    await getVolume("BTCUSDT", interval, limit, percentage);
  const btcTotalVolume = totalVolume;
  const btcLatestVolume = latestVolume;
  const btcAverageVolume = averageVolume;
  const btcClosePrice = closePrice;

  return { btcTotalVolume, btcLatestVolume, btcAverageVolume, btcClosePrice };
}

async function generateVolumeAlert(symbol, interval, limit, percentage) {
  try {
    const { totalVolume, latestVolume, averageVolume, closePrice } =
      await getVolume(symbol, interval, limit, percentage);
    const { btcLatestVolume, btcAverageVolume } = await getBTCVolume(
      interval,
      limit,
      percentage
    );

    const volumeChange = latestVolume - averageVolume;
    const btcVolumeChange = btcLatestVolume - btcAverageVolume;

    // criteria 1 : increase > 50x
    const isVolumeIncreasedBy50x = volumeChange / averageVolume > percentage;

    // criteria 2 : benchmark BTC did not increase > 10x
    const isBtcVolumeIncreasedBy10x = btcVolumeChange / btcAverageVolume > 10;

    // criteria 3 : consideration > 500k usd
    const isConsiderationLargerThan500k = latestVolume * closePrice > 500000;

    if (
      isVolumeIncreasedBy50x &&
      !isBtcVolumeIncreasedBy10x &&
      isConsiderationLargerThan500k
    ) {
      // generate message to telegram
      let content = "";
      content += `🚨🚨🚨 Volume Alert 🚨🚨🚨\n`;
      content += `${symbol} $${closePrice} (${limit - 2} X ${interval})\n`;
      content += `latest: ${latestVolume
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n`;
      content += `average: ${averageVolume
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n\n`;
      content += `${((volumeChange / averageVolume) * 100)
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}% increased in volume.`;

      bot.sendMessage("@tradeblocks_bot", content);
      console.log(
        `${symbol} >> total: ${totalVolume} average: ${averageVolume} latest: ${latestVolume}`
      );

      // save record to database
      console.log(`***** Saving ${symbol} volume alert *****`);

      const volumeAlert = new VolumeAlert({
        symbol: symbol,
        closePrice: closePrice,
        totalVolume: totalVolume,
        averageVolume: averageVolume,
        latestVolume: latestVolume,
        btcAverageVolume: btcAverageVolume,
        btcLatestVolume: btcLatestVolume,
        isVolumeIncreasedBy50x: isVolumeIncreasedBy50x,
        isBtcVolumeIncreasedBy10x: isBtcVolumeIncreasedBy10x,
        isConsiderationLargerThan500k: isConsiderationLargerThan500k,
      });

      await volumeAlert.save();
      console.log(`>> saving finished!`);
    } else {
      console.log(
        `volume : ${isVolumeIncreasedBy50x} || btc : ${isBtcVolumeIncreasedBy10x} || consideration : ${isConsiderationLargerThan500k}`
      );
    }
  } catch (error) {
    console.log("!!!!!!!!!!!!!! ERROR !!!!!!!!!!!!!!!!!", error);
  }
}

module.exports = { generateVolumeAlert };
