import * as express from "express";
import UserCtrl from "./controllers/user";
import YrvCtrl from "./controllers/yrv";
import * as jwt from "jsonwebtoken";
import { publicKey } from "../api";
import * as RateLimit from "express-rate-limit";
const { version } = require("../../package.json");

export default function setRoutes(app) {

  const router = express.Router();

  const userCtrl = new UserCtrl();
  const yrvCtrl = new YrvCtrl();

  const checkAuth = ((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-auth-token"];
    if (token) {
      jwt.verify(token, publicKey, { algorithms: "RS256" }, (err, decoded) => {
        if (err) {
          if (err.message === "jwt expired") {
            return res.status(403).send({ message: "Sorry, your token is expired." });
          }
          console.log(err);
          return res.status(403).send({ message: "Failed to auth your token" });
        } else {
          userCtrl.model.findOne({ _id: decoded.user._id }, (error, obj) => {
            if (error || !obj) {
              res.status(403).send({ message: "User does not exist" });
              console.log(error);
            } else {
              obj.password = undefined;
              req.decoded = { user: obj };
              next();
            }
          });
        }
      });
    } else {
      return res.status(403).send({ message: "No token provided" });
    }
  });

  const versionReq = ((req, res) => {
    return res.status(200).send({ version });
  });

  app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

  const defaultPublicRateLimiter = new RateLimit({
    windowMs: 5 * 60 * 1000, // 5 min
    delayAfter: 190, // slowing down after 190 requests
    delayMs: 1000, // slow down every request by 1s
    max: 200 // blocking after 200 requests
  });

  const defaultUserRateLimiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    delayAfter: 15, // slowing down after 15 requests
    delayMs: 2 * 1000, // slow down every request by 2s
    max: 20 // blocking after 20 requests
  });

  router.route("/").get((req, res) => {
    res.redirect("docs");
  });

  // Utils
  router.route("/api/v").get(defaultPublicRateLimiter, versionReq);

  // Users
  router.route("/users/login").post(defaultUserRateLimiter, userCtrl.login);
  router.route("/users").post(defaultUserRateLimiter, userCtrl.insert);

  // YRV
  router.route("/yrvs/random").get(defaultPublicRateLimiter, yrvCtrl.getRandom);
  router.route("/yrvs").get(defaultPublicRateLimiter, yrvCtrl.getAll);
  router.route("/yrvs/count").get(defaultPublicRateLimiter, yrvCtrl.count);
  router.route("/yrvs/id/:id").get(defaultPublicRateLimiter, yrvCtrl.get);
  router.route("/yrvs/id/:id/viewed").get(defaultPublicRateLimiter, yrvCtrl.viewed);

  // User protected
  router.route("/users").get(checkAuth, userCtrl.getAll);
  router.route("/users/updtoken").get(checkAuth, userCtrl.updateToken);
  router.route("/users/count").get(checkAuth, userCtrl.count);
  router.route("/users/id/:id").get(checkAuth, userCtrl.get);
  router.route("/users/id/:id").put(checkAuth, userCtrl.update);
  router.route("/users/id/:id").delete(checkAuth, userCtrl.remove);

  // YRV protected
  router.route("/yrvs").post(checkAuth, yrvCtrl.insert);
  router.route("/yrvs/id/:id").put(checkAuth, yrvCtrl.update);
  router.route("/yrvs/id/:id").delete(checkAuth, yrvCtrl.remove);

  // Apply prefix to app
  app.use("/", router);
}
