const passport = require("passport");
const { ApiError } = require("./apiError");
const httpStatus = require("http-status");
const errors = require("../config/errors");
const roles = require("../config/roles");

const verify = (req, res, resolve, reject, rights) => async (err, user) => {
  if (err || !user) {
    const statusCode = httpStatus.UNAUTHORIZED;
    const message = errors.auth.invalidToken;
    return reject(new ApiError(statusCode, message));
  }

  req.user = user;

  const requireNoVerified = rights[2];

  if (!requireNoVerified && !user.verified.email) {
    const statusCode = httpStatus.FORBIDDEN;
    const message = errors.auth.emailNotVerified;
    return reject(new ApiError(statusCode, message));
  }

  if (rights.length) {
    const action = rights[0];
    const resource = rights[1];
    const permission = roles.can(req.user.role)[action](resource);

    if (!permission.granted) {
      const statusCode = httpStatus.FORBIDDEN;
      const message = errors.auth.hasNoRights;
      return reject(new ApiError(statusCode, message));
    }

    res.locals.permission = permission;
  }

  resolve();
};

const auth = (...rights) => {
  return async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verify(req, res, resolve, reject, rights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };
};

module.exports = auth;
