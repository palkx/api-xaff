import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import BaseCtrl from './base';
import { privateKey } from '../../api';

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    if (req.body.email && req.body.password) {
      this.model.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          return res.sendStatus(403);
        }
        user.comparePassword(req.body.password, (error, isMatch) => {
          if (!isMatch) {
            return res.sendStatus(403);
          }
          jwt.sign({ user: user }, privateKey, { algorithm: 'RS256', expiresIn: 7 * 24 * 60 * 60 }, (e, token) => {
            if (e) {
              console.log(e);
              res.status(500);
            }
            res.status(200).json({ token: token });
          });
        });
      });
    } else {
      res.sendStatus(400);
    }
  }

  updateToken = (req, res) => {
    jwt.sign({ user: req.decoded.user }, privateKey, { algorithm: 'RS256', expiresIn: 7 * 24 * 60 * 60 }, (e, token) => {
      if (e) {
        console.log(e);
        res.status(500);
      }
      res.status(200).json({ token: token });
    });
  }
}
