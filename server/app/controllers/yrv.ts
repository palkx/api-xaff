import * as jwt from 'jsonwebtoken';
import YRV from '../models/yrv';
import BaseCtrl from './base';

export default class YrvCtrl extends BaseCtrl {
  model = YRV;

  getRandom = (req, res) => {
    if (req.body.disabled || req.query.disabled || 0) {
      this.model.count((err, count) => {
        if (err) {
          return res.sendStatus(503);
        }
        const rand = Math.floor(Math.random() * count);
        this.model.findOne().skip(rand).then(yrv => {
          this.model.findOneAndUpdate({ _id: yrv._id, }, {$inc : {'views' : 1}}, (error) => {
            if (!error) {
              res.status(200).json(yrv);
            } else {
              res.sendStatus(500);
            }
          });
        });
      });
    } else {
      this.model.count({ disabled: false }, (err, count) => {
        if (err) {
          return res.sendStatus(503);
        }
        const rand = Math.floor(Math.random() * count);
        this.model.findOne({ disabled: false }).skip(rand).then(yrv => {
          this.model.findOneAndUpdate({ _id: yrv._id, }, {$inc : {'views' : 1}}, (error) => {
            if (!error) {
              res.status(200).json(yrv);
            } else {
              res.sendStatus(500);
            }
          });
        });
      });
    }
  }
}
