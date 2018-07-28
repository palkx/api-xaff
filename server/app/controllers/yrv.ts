/*
 * Created on Sat Jul 28 2018
 * Copyright © 2017-2018 Mikhail K. (iSm1le)
 * Licensed under the Apache License, Version 2.0
 */
// import * as jwt from "jsonwebtoken";
import YRV from "../models/yrv";
import BaseCtrl from "./base";

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
          res.status(200).json(yrv);
        });
      });
    } else {
      this.model.count({ disabled: false }, (err, count) => {
        if (err) {
          return res.sendStatus(503);
        }
        const rand = Math.floor(Math.random() * count);
        this.model.findOne({ disabled: false }).skip(rand).then(yrv => {
          res.status(200).json(yrv);
        });
      });
    }
  }

  viewed = (req, res) => {
    if (req.params.id) {
      if (req.params.id.length === 11) {
        this.model.findOneAndUpdate({ videoId: req.params.id, }, {$inc : {views : 1}}, (error) => {
          if (!error) {
            res.sendStatus(200);
          } else {
            res.sendStatus(500);
          }
        });
      } else {
        this.model.findOneAndUpdate({ _id: req.params.id, }, {$inc : {views : 1}}, (error) => {
          if (!error) {
            res.sendStatus(200);
          } else {
            res.sendStatus(500);
          }
        });
      }
    } else {
      res.sendStatus(400);
    }
  }

  // Get by id
  vGet = (req, res) => {
    this.model.findOne({ videoId: req.params.id }, (err, obj) => {
      if (err || !obj) {
        console.error(err);
        res.sendStatus(404);
      } else {
        res.status(200).json(obj);
      }
    });
  }

  // Update by id
  vUpdate = (req, res) => {
    this.model.findOneAndUpdate({ videoId: req.params.id }, req.body, (err) => {
      if (err) {
        return console.error(err);
      } else {
        res.sendStatus(200);
      }
    });
  }

  // Delete by id
  vRemove = (req, res) => {
    this.model.findOneAndRemove({ videoId: req.params.id }, (err) => {
      if (err) {
        return console.error(err);
      } else {
        res.sendStatus(200);
      }
    });
  }
}
