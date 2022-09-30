const setupSanitization = require("./sanitize");
const setupMongoDB = require("./db");
const routes = require("../routes");
const config = require("../config/server");
const {
  errorHandler,
  errorConverter,
  unsupportedRouteHandler,
} = require("../middleware/apiError");
const passport = require("passport");
const { jwtStrategy } = require("../middleware/passport");

module.exports = (app) => {
  setupMongoDB();
  setupSanitization(app);
  app.use(passport.initialize());
  passport.use("jwt", jwtStrategy);
  app.use("/api", routes);
  app.use(unsupportedRouteHandler);
  app.use(errorConverter);
  app.use(errorHandler);

  app.listen(config.PORT, () => {
    console.log(`App is listening on port ${config.PORT}`);
  });
};
