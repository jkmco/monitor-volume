const ccxt = require("ccxt");

const binance = new ccxt.binance({
  enableRateLimit: true,
});
const binanceusdm = new ccxt.binanceusdm({
  enableRateLimit: true,
});
const ftx = new ccxt.ftx({
  enableRateLimit: true,
});
const bybit = new ccxt.bybit({
  enableRateLimit: true,
});
const deribit = new ccxt.deribit({
  enableRateLimit: true,
});
const bitfinex2 = new ccxt.bitfinex2({
  enableRateLimit: true,
});
const bitmex = new ccxt.bitmex({
  enableRateLimit: true,
});
const kucoin = new ccxt.kucoin({
  enableRateLimit: true,
});
const gateio = new ccxt.gateio({
  enableRateLimit: true,
});

module.exports = {
  binance,
  binanceusdm,
  ftx,
  bybit,
  deribit,
  bitfinex2,
  bitmex,
  kucoin,
  gateio,
};
