import * as request from 'request-promise';
const { version } = require('../../../package.json');

export default function TelegramBot(telegrafApp) {
  const me = this;
  me.telegrafApp = telegrafApp;

  console.log('TelegramBot instance created!');

  telegrafApp.command('start', me.onStartCommand.bind(me));
  telegrafApp.command('cat', me.onCatCommand.bind(me));
  telegrafApp.command('ranime', me.onRandomAnimeCommand.bind(me));
  telegrafApp.command('myid', me.onMyIdCommand.bind(me));
}

TelegramBot.prototype = {
  onStartCommand(ctx) {
    return ctx.reply('Hello');
  },
  onCatCommand(ctx) {
    const cat = 'http://thecatapi.com/api/images/get?format=src&type=png&size=med';
    return ctx.replyWithPhoto({ url: cat });
  },
  async onRandomAnimeCommand(ctx) {
    const animeImage = await request({
      uri: `https://yande.re/post.json?page=${Math.floor((Math.random() * 8800) + 1)}`,
      headers: {'User-Agent': `XaFF Telegram Bot v${version} (https://bitbucket.org/xaff/api/)` },
      json: true
    });
    if (animeImage.length === 0) {
      return ctx.reply('Oooppss. I am getting some error, sorry. I will fix it as fast as i can.');
    }
    return ctx.replyWithMarkdown(`[‌‌](${animeImage[0].sample_url}) [Source](${animeImage[0].file_url})`);
  },
  onMyIdCommand(ctx) {
    return ctx.reply(ctx.from.id);
  }
};
