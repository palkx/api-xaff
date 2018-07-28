/*
 * Created on Sat Jul 28 2018
 * Copyright © 2017-2018 Mikhail K. (iSm1le)
 * Licensed under the Apache License, Version 2.0
 */
import * as bodyParser from "body-parser";
import * as express from "express";
import * as morgan from "morgan";
import * as mongoose from "mongoose";
import * as fs from "fs";
const config = require("../config/config.json");
export const privateKey = fs.readFileSync(__dirname + "/../config/private.key");
export const publicKey = fs.readFileSync(__dirname + "/../config/public.key");

import setRoutes from "./app/routes";

const app = express();
app.set("port", (config.port || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

/* COMMENT THIS BLOCK IF YOU DON'T WANT CORS REQUESTS TO WORK */

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.get("origin") || req.get("host") || "NONE");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, charset, x-auth-token");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  if (req.method === "OPTIONS") {
    res.status(204);
  }
  next();
});

mongoose.connect(config.dbUrl);
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");

  setRoutes(app);

  app.listen(app.get("port"), () => {
    console.log("api is listening on port " + app.get("port"));
  });

});

export { app };

/*
  TODO:
  add models: forms, permissions, roles
*/
