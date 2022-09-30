const router = require("express").Router();
const authRoute = require("./user/auth.route");
const usersRoute = require("./user/users.route");

const routes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: usersRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
