import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import BaseCtrl from './base';
const config = require('../../../config/config');

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) {
        return res.sendStatus(403);
      }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) {
          return res.sendStatus(403);
        }
        const token = jwt.sign({ user: user }, config.sToken, { expiresIn: 24 * 60 * 60 }); // , { expiresIn: 10 } seconds
        res.status(200).json({ token: token });
      });
    });
  }

}
