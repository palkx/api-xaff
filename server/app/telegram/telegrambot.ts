export default function TelegramBot(telegrafApp) {
  const me = this;
  me.telegrafApp = telegrafApp;

  console.log('TelegramBot instance created!');

  telegrafApp.command('start', me.onStartCommand.bind(me));
  telegrafApp.command('cat', me.onCatCommand.bind(me));
}

TelegramBot.prototype = {
  onStartCommand(ctx) {
    return ctx.reply('Hello');
  },
  onCatCommand(ctx) {
    const cat = 'http://thecatapi.com/api/images/get?format=src&type=png&size=med';
    return ctx.replyWithPhoto({ url: cat });
  }
};
