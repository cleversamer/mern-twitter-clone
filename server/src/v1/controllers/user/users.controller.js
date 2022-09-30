const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { CLIENT_SCHEMA } = require("../../models/user.model");
const { emailService, usersService } = require("../../services");
const { ApiError } = require("../../middleware/apiError");
const errors = require("../../config/errors");
const success = require("../../config/success");

module.exports.isAuth = async (req, res, next) => {
  try {
    res.status(httpStatus.OK).json(_.pick(req.user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.verifyUserEmail = async (req, res, next) => {
  try {
    const user = req.user;
    const { code } = req.body;

    if (user.verified.email) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.alreadyVerified;
      throw new ApiError(statusCode, message);
    }

    if ((!code && code != 0) || code.toString().length !== 4) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.invalidCode;
      throw new ApiError(statusCode, message);
    }

    if (user.emailVerificationCode.code == code) {
      const diff = new Date() - new Date(user.emailVerificationCode.expiresAt);
      const activeCode = diff < 10 * 60 * 1000;
      if (!activeCode) {
        const statusCode = httpStatus.BAD_REQUEST;
        const message = errors.auth.expiredCode;
        throw new ApiError(statusCode, message);
      }

      user.verifyEmail();
      const verifiedUser = await user.save();

      return res
        .status(httpStatus.OK)
        .json(_.pick(verifiedUser, CLIENT_SCHEMA));
    }

    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.incorrectCode;
    throw new ApiError(statusCode, message);
  } catch (err) {
    next(err);
  }
};

module.exports.resendEmailVerificationCode = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.verified.email) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.user.alreadyVerified;
      throw new ApiError(statusCode, message);
    }

    user.updateEmailVerificationCode();
    await user.save();

    await emailService.registerEmail(user.email, user);

    res
      .status(httpStatus.OK)
      .json({ ok: true, message: success.auth.emailVerificationCodeSent });
  } catch (err) {
    next(err);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { newPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;
    await user.save();

    res.status(httpStatus.CREATED).json(_.pick(user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.sendForgotPasswordCode = async (req, res, next) => {
  try {
    const { emailOrUsername } = req.query;
    const user = await usersService.findUserByEmailOrUsername(emailOrUsername);

    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.auth.emailNotUsed;
      throw new ApiError(statusCode, message);
    }

    user.generatePasswordResetCode();
    const updatedUser = await user.save();

    await emailService.forgotPasswordEmail(user.email, updatedUser);

    res
      .status(httpStatus.OK)
      .json({ ok: true, message: success.auth.passwordResetCodeSent });
  } catch (err) {
    next(err);
  }
};

module.exports.handleForgotPassword = async (req, res, next) => {
  try {
    const { emailOrUsername, code, newPassword } = req.body;
    const user = await usersService.findUserByEmailOrUsername(emailOrUsername);

    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.auth.emailNotUsed;
      throw new ApiError(statusCode, message);
    }

    if ((!code && code != 0) || code.toString().length !== 4) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.auth.invalidCode;
      throw new ApiError(statusCode, message);
    }

    if (user.resetPasswordCode.code == code) {
      const diff = new Date() - new Date(user.resetPasswordCode.expiresAt);
      const condition = diff < 10 * 60 * 1000;
      if (!condition) {
        const statusCode = httpStatus.BAD_REQUEST;
        const message = errors.auth.expiredCode;
        throw new ApiError(statusCode, message);
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      user.password = hashed;
      await user.save();

      return res.status(httpStatus.OK).json(_.pick(user, CLIENT_SCHEMA));
    }

    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.auth.incorrectCode;
    throw new ApiError(statusCode, message);
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, email, username, password } = req.body;
    const avatar = req?.files?.avatar || null;

    const newUser = await usersService.updateProfile(
      user,
      name,
      avatar,
      email,
      username,
      password
    );

    const body = {
      user: _.pick(newUser, CLIENT_SCHEMA),
      token: newUser.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(body);
  } catch (err) {
    next(err);
  }
};

///////////////////////////// ADMIN /////////////////////////////
module.exports.updateUserProfile = async (req, res, next) => {
  try {
    const { emailOrUsername, name, email, username, password } = req.body;
    const avatar = req?.files?.avatar || null;

    const updatedUser = await usersService.updateUserProfile(
      emailOrUsername,
      name,
      avatar,
      email,
      username,
      password
    );

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.verifyUser = async (req, res, next) => {
  try {
    const { emailOrUsername } = req.body;

    const updatedUser = await usersService.verifyUser(emailOrUsername);

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.changeUserRole = async (req, res, next) => {
  try {
    const { emailOrUsername, role } = req.body;

    const updatedUser = await usersService.changeUserRole(
      emailOrUsername,
      role
    );

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.findUserByEmailOrUsername = async (req, res, next) => {
  try {
    // This is come from `req.params` but added to `req.body`
    // in the validation middleware.
    // GET Requests don't accept body data.
    const { emailOrUsername } = req.body;

    const user = await usersService.findUserByEmailOrUsername(
      emailOrUsername,
      true
    );

    res.status(httpStatus.OK).json(_.pick(user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};
