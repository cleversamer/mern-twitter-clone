const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const loginValidator = [
  check("emailOrUsername")
    .trim()
    .isString()
    .isLength({ min: 3, max: 128 })
    .withMessage(errors.auth.invalidEmailOrUsername)
    .bail(),

  check("password")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(errors.auth.invalidPassword),

  commonMiddleware.next,
];

const registerValidator = [
  commonMiddleware.checkFile("avatar", ["png", "jpg", "jpeg"], false),

  check("name")
    .trim()
    .isLength({ min: 8, max: 64 })
    .withMessage(errors.auth.invalidName),

  check("email")
    .trim()
    .isEmail()
    .withMessage(errors.auth.invalidEmailOrUsername)
    .bail(),

  check("username")
    .trim()
    .isLength({ min: 3, max: 64 })
    .withMessage(errors.auth.invalidUsername)
    .bail(),

  check("password")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(errors.auth.invalidPassword),

  commonMiddleware.next,
];

const resetPasswordValidator = [
  check("newPassword")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(errors.auth.invalidPassword),

  commonMiddleware.next,
];

const forgotPasswordValidator = [
  check("emailOrUsername")
    .trim()
    .isString()
    .isLength({ min: 3, max: 128 })
    .withMessage(errors.auth.invalidEmailOrUsername)
    .bail(),

  check("newPassword")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(errors.auth.invalidPassword),

  commonMiddleware.next,
];

const validateEmailOrUsername = [
  (req, res, next) => {
    req.body.emailOrUsername = req.query.emailOrUsername;

    next();
  },

  check("emailOrUsername")
    .trim()
    .isString()
    .isLength({ min: 3, max: 128 })
    .withMessage(errors.auth.invalidEmailOrUsername)
    .bail(),

  commonMiddleware.next,
];

module.exports = {
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  forgotPasswordValidator,
  validateEmailOrUsername,
};
