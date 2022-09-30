const { User } = require("../../models/user.model");
const bcrypt = require("bcrypt");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");
const usersService = require("./users.service");

module.exports.registerWithEmail = async (email, password, name) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashed,
    });

    user.updateEmailVerificationCode();

    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.signInWithEmail = async (email, password) => {
  try {
    const user = await usersService.findUserByEmail(email);

    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.auth.incorrectCredentials;
      throw new ApiError(statusCode, message);
    }

    if (!(await user.comparePassword(password))) {
      const statusCode = httpStatus.UNAUTHORIZED;
      const message = errors.auth.incorrectCredentials;
      throw new ApiError(statusCode, message);
    }

    return user;
  } catch (err) {
    throw err;
  }
};
