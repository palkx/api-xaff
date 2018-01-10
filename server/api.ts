import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import TelegrafApp from './app/telegram/telegramapp';
import TelegramBot from './app/telegram/telegrambot';
const config = require('../config/config.json');

import setRoutes from './app/routes';

const app = express();
app.set('port', (config.port || 3000));

const bot = new TelegramBot(TelegrafApp);

app.use(TelegrafApp.webhookCallback('/' + config.TELEGRAM_WEBHOOK.SECRET_PATH));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

/* COMMENT THIS BLOCK IF YOU DON'T WANT CORS REQUESTS TO WORK */

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, charset, x-auth-token');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS, DELETE, POST');
  next();
});

/* TODO: add groups paths */

mongoose.connect(config.dbUrl, { useMongoClient: true });
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  setRoutes(app);

  app.listen(app.get('port'), () => {
    console.log('api is listening on port ' + app.get('port'));
  });

});

export { app };
