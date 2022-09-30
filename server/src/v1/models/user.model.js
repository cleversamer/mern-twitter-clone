const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const CLIENT_SCHEMA = ["_id", "name", "email", "role", "verified"];

const SUPPORTED_ROLES = ["user", "admin"];

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: SUPPORTED_ROLES,
      default: "user",
    },
    verified: {
      email: {
        type: Boolean,
        default: false,
      },
    },
    emailVerificationCode: {
      code: {
        type: String,
        default: "",
      },
      expiresAt: {
        type: String,
        default: "",
      },
    },
    resetPasswordCode: {
      code: {
        type: String,
        default: "",
      },
      expiresAt: {
        type: String,
        default: "",
      },
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

userSchema.methods.updateEmailVerificationCode = function () {
  const code = Math.floor(1000 + Math.random() * 9000);
  const expiresAt = new Date() + 10 * 60 * 1000;
  this.emailVerificationCode = { code, expiresAt };
};

userSchema.methods.generatePasswordResetCode = function () {
  const code = Math.floor(1000 + Math.random() * 9000);
  const expiresAt = new Date() + 10 * 60 * 1000;
  this.resetPasswordCode = { code, expiresAt };
};

userSchema.methods.verifyEmail = function () {
  this.verified.email = true;
};

userSchema.methods.genAuthToken = function () {
  const body = { sub: this._id.toHexString() };
  return jwt.sign(body, process.env["JWT_PRIVATE_KEY"]);
};

userSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

const User = model("User", userSchema);

module.exports = {
  User,
  CLIENT_SCHEMA,
  SUPPORTED_ROLES,
};
