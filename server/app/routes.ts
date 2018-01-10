import * as express from 'express';
import UserCtrl from './controllers/user';
import YrvCtrl from './controllers/yrv';
const config = require('../../config/config');
import * as jwt from 'jsonwebtoken';

export default function setRoutes(app) {

  const router = express.Router();

  const userCtrl = new UserCtrl();
  const yrvCtrl = new YrvCtrl();

  const checkAuth = ((req, res, next) => {
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    const token = req.body.token || req.query.token || req.headers['x-auth-token'];
    if (token) {
      jwt.verify(token, config.sToken, (err, decoded) => {
        if (err) {
          return res.status(403).send({ message: 'Failed to auth your token' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({ message: 'No token provided' });
    }
  });

  router.route('/').get(function (req, res) {
    res.redirect('docs');
  });

  // Users
  router.route('/user/login').post(userCtrl.login);
  router.route('/user').post(userCtrl.insert);

  // YRV
  router.route('/yrv/random').get(yrvCtrl.getRandom);
  router.route('/yrvs').get(yrvCtrl.getAll);
  router.route('/yrvs/count').get(yrvCtrl.count);
  router.route('/yrv/id/:id').get(yrvCtrl.get);

  // User protected
  router.route('/users').get(checkAuth, userCtrl.getAll);
  router.route('/users/count').get(checkAuth, userCtrl.count);
  router.route('/user/id/:id').get(checkAuth, userCtrl.get);
  router.route('/user/id/:id').put(checkAuth, userCtrl.update);
  router.route('/user/id/:id').delete(checkAuth, userCtrl.remove);

  // YRV protected
  router.route('/yrv').post(checkAuth, yrvCtrl.insert);
  router.route('/yrv/id/:id').put(checkAuth, yrvCtrl.update);
  router.route('/yrv/id/:id').delete(checkAuth, yrvCtrl.remove);

  // Apply prefix to app
  app.use('/', router);
}
