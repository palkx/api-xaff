import * as Telegraf from 'telegraf';
const config = require('../../../config/config.json');

const telegrafApp = new Telegraf(config.TELEGRAM_TOKEN);

telegrafApp.telegram.getMe().then((botInfo) => {
  telegrafApp.options.username = botInfo.username;
});

telegrafApp.telegram.setWebhook(config.TELEGRAM_WEBHOOK.URL + '/' + config.TELEGRAM_WEBHOOK.SECRET_PATH, config.TELEGRAM_WEBHOOK.MAXCONN);

export default telegrafApp;
