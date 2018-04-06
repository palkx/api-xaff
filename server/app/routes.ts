import * as express from 'express';
import UserCtrl from './controllers/user';
import YrvCtrl from './controllers/yrv';
import * as jwt from 'jsonwebtoken';
import { publicKey } from '../api';
const { version } = require('../../package.json');

export default function setRoutes(app) {

  const router = express.Router();

  const userCtrl = new UserCtrl();
  const yrvCtrl = new YrvCtrl();

  const checkAuth = ((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-auth-token'];
    if (token) {
      jwt.verify(token, publicKey, { algorithms: 'RS256' }, (err, decoded) => {
        if (err) {
          if (err.message === 'jwt expired') {
            return res.status(403).send({ message: 'Sorry, your token is expired.' });
          }
          console.log(err);
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

  const versionReq = ((req, res) => {
    return res.status(200).send({ version: version });
  });

  router.route('/').get(function (req, res) {
    res.redirect('docs');
  });

  // Utils
  router.route('/api/v').get(versionReq);

  // Users
  router.route('/users/login').post(userCtrl.login);
  router.route('/users').post(userCtrl.insert);

  // YRV
  router.route('/yrvs/random').get(yrvCtrl.getRandom);
  router.route('/yrvs').get(yrvCtrl.getAll);
  router.route('/yrvs/count').get(yrvCtrl.count);
  router.route('/yrvs/id/:id').get(yrvCtrl.get);

  // User protected
  router.route('/users').get(checkAuth, userCtrl.getAll);
  router.route('/users/updtoken').get(checkAuth, userCtrl.updateToken);
  router.route('/users/count').get(checkAuth, userCtrl.count);
  router.route('/users/id/:id').get(checkAuth, userCtrl.get);
  router.route('/users/id/:id').put(checkAuth, userCtrl.update);
  router.route('/users/id/:id').delete(checkAuth, userCtrl.remove);

  // YRV protected
  router.route('/yrvs').post(checkAuth, yrvCtrl.insert);
  router.route('/yrvs/id/:id').put(checkAuth, yrvCtrl.update);
  router.route('/yrvs/id/:id').delete(checkAuth, yrvCtrl.remove);

  // Apply prefix to app
  app.use('/', router);
}
