const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const loginValidator = [
  check("email").trim().isEmail().withMessage(errors.auth.invalidEmail).bail(),

  check("password")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(errors.auth.invalidPassword),

  commonMiddleware.next,
];

const registerValidator = [
  check("name")
    .trim()
    .isLength({ min: 8, max: 64 })
    .withMessage(errors.auth.invalidName),

  check("email").trim().isEmail().withMessage(errors.auth.invalidEmail).bail(),

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
  check("email").trim().isEmail().withMessage(errors.auth.invalidEmail).bail(),

  check("newPassword")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(errors.auth.invalidPassword),

  commonMiddleware.next,
];

const emailValidator = [
  check("email").trim().isEmail().withMessage(errors.auth.invalidEmail).bail(),

  commonMiddleware.next,
];

module.exports = {
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  forgotPasswordValidator,
  emailValidator,
};
