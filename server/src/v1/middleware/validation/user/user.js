const { SUPPORTED_ROLES } = require("../../../models/user.model");
const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const validateUpdateProfile = [
  commonMiddleware.checkFile("avatar", ["png", "jpg", "jpeg"], false),

  commonMiddleware.conditionalCheck(
    "name",
    check("name")
      .trim()
      .isLength({ min: 8, max: 64 })
      .withMessage(errors.auth.invalidName)
  ),

  commonMiddleware.conditionalCheck(
    "email",
    check("email").trim().isEmail().withMessage(errors.auth.invalidEmail).bail()
  ),

  commonMiddleware.conditionalCheck(
    "username",
    check("username")
      .trim()
      .isLength({ min: 3, max: 64 })
      .withMessage(errors.auth.invalidUsername)
      .bail()
  ),

  commonMiddleware.conditionalCheck(
    "password",
    check("password")
      .trim()
      .isLength({ min: 8, max: 32 })
      .withMessage(errors.auth.invalidPassword)
  ),

  commonMiddleware.next,
];

const validateUpdateUserProfile = [
  check("emailOrUsername")
    .trim()
    .isString()
    .isLength({ min: 3, max: 128 })
    .withMessage(errors.auth.invalidEmailOrUsername)
    .bail(),

  ...validateUpdateProfile,
];

const validateUpdateUserRole = [
  check("emailOrUsername")
    .trim()
    .isString()
    .isLength({ min: 3, max: 128 })
    .withMessage(errors.auth.invalidEmailOrUsername)
    .bail(),

  check("role").isIn(SUPPORTED_ROLES).withMessage(errors.user.invalidRole),

  commonMiddleware.next,
];

const validateVerifyUser = [
  check("emailOrUsername")
    .trim()
    .isString()
    .isLength({ min: 3, max: 128 })
    .withMessage(errors.auth.invalidEmailOrUsername)
    .bail(),

  commonMiddleware.next,
];

const validateFindUserByEmail = [
  (req, res, next) => {
    req.body.emailOrUsername = req.params.id;

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
  validateUpdateProfile,
  validateUpdateUserProfile,
  validateUpdateUserRole,
  validateVerifyUser,
  validateFindUserByEmail,
};
