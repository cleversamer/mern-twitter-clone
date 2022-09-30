const { User } = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const emailService = require("./email.service");
const { ApiError } = require("../../middleware/apiError");
const errors = require("../../config/errors");
const bcrypt = require("bcrypt");

module.exports.findUserByEmail = async (email, withError = false) => {
  try {
    const user = await User.findOne({ email });

    if (withError && !user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    return user;
  } catch (err) {
    throw err;
  }
};

module.exports.findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (err) {
    throw err;
  }
};

module.exports.validateToken = (token) => {
  try {
    return jwt.verify(token, process.env["JWT_PRIVATE_KEY"]);
  } catch (err) {
    throw err;
  }
};

module.exports.updateProfile = async (user, name, email, password) => {
  try {
    let userChanged = false;

    if (name && user.name !== name) {
      user.name = name;
      userChanged = true;
    }

    if (password && user.password !== password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      user.password = hashed;
      userChanged = true;
    }

    if (email && user.email !== email) {
      const emailUsed = await this.findUserByEmail(email);
      if (emailUsed) {
        const statusCode = httpStatus.NOT_FOUND;
        const message = errors.auth.emailUsed;
        throw new ApiError(statusCode, message);
      }

      user.email = email;
      user.verified.email = false;
      userChanged = true;
      user.updateEmailVerificationCode();
      await emailService.registerEmail(email, user);
    }

    return userChanged ? await user.save() : user;
  } catch (err) {
    throw err;
  }
};

///////////////////////////// ADMIN /////////////////////////////
module.exports.changeUserRole = async (userId, role) => {
  try {
    const user = await this.findUserById(userId);

    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    user.role = role;
    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.validateUser = async (userId) => {
  try {
    const user = await this.findUserById(userId);

    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    user.verified.email = true;
    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports.updateUserProfile = async (userId, name, email, password) => {
  try {
    let userChanged = false;

    const user = await this.findUserById(userId);
    if (!user) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.user.notFound;
      throw new ApiError(statusCode, message);
    }

    if (name && user.name !== name) {
      user.name = name;
      userChanged = true;
    }

    if (password && user.password !== password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      user.password = hashed;
      userChanged = true;
    }

    if (email && user.email !== email) {
      const emailUsed = await this.findUserByEmail(email);
      if (emailUsed) {
        const statusCode = httpStatus.NOT_FOUND;
        const message = errors.auth.emailUsed;
        throw new ApiError(statusCode, message);
      }

      user.email = email;
      user.verified.email = false;
      userChanged = true;
      user.updateEmailVerificationCode();
      await emailService.registerEmail(email, user);
    }

    return userChanged ? await user.save() : user;
  } catch (err) {
    throw err;
  }
};
