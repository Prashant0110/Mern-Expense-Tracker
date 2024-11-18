const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const userRouter = express.Router();

router.post("/api/v1/users/register", userController.registerUser);

router.get("/api/v1/users/login", userController.login);

module.exports = router;
