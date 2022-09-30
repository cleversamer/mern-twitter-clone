const { json, urlencoded, static } = require("express");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const upload = require("express-fileupload");
const config = require("../config/server");

module.exports = (app) => {
  app.use(json({ limit: config.UPLOAD_LIMIT }));
  app.use(urlencoded({ extended: true }));
  app.use(static("uploads"));
  app.use(cors({ origin: true }));
  app.use(upload());
  app.use(xss());
  app.use(mongoSanitize());
};
