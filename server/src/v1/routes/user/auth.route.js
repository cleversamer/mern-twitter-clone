const router = require("express").Router();
const { authController } = require("../../controllers");
const { authValidator } = require("../../middleware/validation");

router.post(
  "/register",
  [authValidator.registerValidator],
  authController.register
);

router.post("/login", [authValidator.loginValidator], authController.signin);

module.exports = router;
