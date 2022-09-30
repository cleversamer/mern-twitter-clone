const { User } = require("../../models/user.model");
const bcrypt = require("bcrypt");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");
const usersService = require("./users.service");
const localStorage = require("../storage/localStorage.service");

module.exports.registerWithEmail = async (
  email,
  password,
  name,
  username,
  avatar
) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashed,
      username,
    });

    if (avatar) {
      const file = await localStorage.storeFile(avatar);
      user.avatarURL = file.path;
    }

    user.updateEmailVerificationCode();

    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.signInWithEmailUsername = async (emailOrUsername, password) => {
  try {
    const user = await usersService.findUserByEmailOrUsername(emailOrUsername);

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
