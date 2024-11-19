const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const Authentication = require("../middlewares/Authentication");
const isAuthenticated = require("../middlewares/Authentication");

const userRouter = express.Router();

router.post("/api/v1/users/register", userController.registerUser);
router.post("/api/v1/users/login", userController.login);

router.get(
  "/api/v1/users/profile",

  isAuthenticated,
  userController.profile
);

module.exports = router;
