/*
 * Created on Sat Jul 28 2018
 * Copyright © 2017-2018 Mikhail K. (iSm1le)
 * Licensed under the Apache License, Version 2.0
 */
abstract class BaseCtrl {

    abstract model: any;

  // Get all
  getAll = (req, res) => {
    const limit = Number(req.body.limit || req.query.limit || 10);
    const skip = Number(req.body.page - 1 || req.query.page - 1 || 0) * limit;

    if (limit >= 1 && skip >= 0) {
      this.model.find({}).sort({ created: -1 }).skip(skip).limit(limit).exec((err, docs) => {
        if (err) {
          return console.error(err);
        }
        if (docs.length > 0) {
          res.json(docs);
        } else {
          res.sendStatus(404);
        }
      });
    }
  }

  // Count all
  count = (req, res) => {
    this.model.count((err, count) => {
      if (err) {
        return console.error(err);
      } else {
        res.json(count);
      }
    });
  }

  // Insert
  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.send(401).json({ message: "Duplicated item" });
      } else if (err) {
        res.sendStatus(400);
      } else {
        res.status(200).json(item);
      }
    });
  }

  // Get by id
  get = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, obj) => {
      if (err || !obj) {
        console.error(err);
        res.sendStatus(404);
      } else {
        res.json(obj);
      }
    });
  }

  // Update by id
  update = (req, res) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
      if (err) {
        return console.error(err);
      } else {
        res.sendStatus(200);
      }
    });
  }

  // Delete by id
  remove = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) {
        return console.error(err);
      } else {
        res.sendStatus(200);
      }
    });
  }

}

export default BaseCtrl;
