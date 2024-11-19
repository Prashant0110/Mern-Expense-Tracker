//User Registration

const expressAsyncHandler = require("express-async-handler");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  //Register User
  registerUser: expressAsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  }),

  login: expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({
      message: "Login Successful",
      token,

      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),

  profile: expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    console.log(req.user);
    if (!user) {
      throw new Error("User not found");
    }

    res.json({
      username: user.username,
      email: user.email,
    });
  }),
};

module.exports = userController;
