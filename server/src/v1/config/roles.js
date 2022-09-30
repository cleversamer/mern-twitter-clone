const AccessControl = require("accesscontrol");

const allRights = {
  "create:any": ["*"],
  "read:any": ["*"],
  "update:any": ["*"],
  "delete:any": ["*"],
};

let grantsObject = {
  admin: {
    user: allRights,
    emailVerificationCode: allRights,
    password: allRights,
  },
  user: {
    user: {
      "read:own": ["*"],
      "update:own": ["*"],
    },
    emailVerificationCode: {
      "read:own": ["*"],
      "update:own": ["*"],
    },
    password: {
      "update:own": ["*"],
    },
  },
};

const roles = new AccessControl(grantsObject);

module.exports = roles;
