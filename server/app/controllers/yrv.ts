import * as jwt from 'jsonwebtoken';
import YRV from '../models/yrv';
import BaseCtrl from './base';

export default class YrvCtrl extends BaseCtrl {
  model = YRV;

  getRandom = (req, res) => {
    this.model.count((err, count) => {
      if (err) {
        return res.sendStatus(503);
      }
      const rand = Math.floor(Math.random() * count);
      this.model.findOne().skip(rand).then(yrv => {
        res.status(200).json(yrv);
      });
    });
  }
}
