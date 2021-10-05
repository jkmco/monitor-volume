const TelegramBot = require("node-telegram-bot-api");

////////////////////// usage //////////////////////////////////////////
// * for sending telegram message
/*
const { bot } = require("./services/connectTelegram");
bot.sendMessage("@tradeblocks_bot", "testing");
 */
//////////////////////////////////////////////////////////////////////

require("dotenv").config();

const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, { polling: true });

module.exports = { bot };
