const { SUPPORTED_ROLES } = require("../../../models/user.model");
const { check } = require("express-validator");
const errors = require("../../../config/errors");
const commonMiddleware = require("../common");

const validateUpdateProfile = [
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
    "password",
    check("password")
      .trim()
      .isLength({ min: 8, max: 32 })
      .withMessage(errors.auth.invalidPassword)
  ),

  commonMiddleware.next,
];

const validateUpdateUserProfile = [
  check("userId").isMongoId().withMessage(errors.user.invalidId),

  ...validateUpdateProfile,
];

const validateUpdateUserRole = [
  check("userId").isMongoId().withMessage(errors.user.invalidId),

  check("role").isIn(SUPPORTED_ROLES).withMessage(errors.user.invalidRole),

  commonMiddleware.next,
];

const validateVerifyUser = [
  check("userId").isMongoId().withMessage(errors.user.invalidId),

  commonMiddleware.next,
];

const validateFindUserByEmail = [
  (req, res, next) => {
    req.body.email = req.params.id;

    next();
  },

  check("email").trim().isEmail().withMessage(errors.auth.invalidEmail).bail(),

  commonMiddleware.next,
];

module.exports = {
  validateUpdateProfile,
  validateUpdateUserProfile,
  validateUpdateUserRole,
  validateVerifyUser,
  validateFindUserByEmail,
};
