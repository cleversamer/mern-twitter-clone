const { authService, emailService } = require("../../services");
const httpStatus = require("http-status");
const { ApiError } = require("../../middleware/apiError");
const { CLIENT_SCHEMA } = require("../../models/user.model");
const errors = require("../../config/errors");
const _ = require("lodash");

module.exports.register = async (req, res, next) => {
  try {
    const { name, email, username, password } = req.body;
    const avatar = req?.files?.avatar || null;

    const user = await authService.registerWithEmail(
      email,
      password,
      name,
      username,
      avatar
    );

    await emailService.registerEmail(email, user);

    const body = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(body);
  } catch (err) {
    if (err.code === errors.codes.duplicateIndexKey) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.emailOrUsernameUsed;
      err = new ApiError(statusCode, message);
    }

    next(err);
  }
};

module.exports.signin = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await authService.signInWithEmailUsername(
      emailOrUsername,
      password
    );

    const body = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.OK).json(body);
  } catch (err) {
    next(err);
  }
};
