const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const Authentication = require("../middlewares/Authentication");
const isAuthenticated = require("../middlewares/Authentication");
const categoryController = require("../controllers/categoryController");
const transactionController = require("../controllers/transactionController");

const userRouter = express.Router();

router.post("/api/v1/users/register", userController.registerUser);
router.post("/api/v1/users/login", userController.login);

router.get("/api/v1/users/profile", isAuthenticated, userController.profile);

router.put(
  "/api/v1/users/updatePassword",
  isAuthenticated,
  userController.password
);

router.put(
  "/api/v1/users/updateProfile",
  isAuthenticated,
  userController.updateUserProfile
);

router.post(
  "/api/v1/users/createCategory",
  isAuthenticated,
  categoryController.createCategory
);

router.get(
  "/api/v1/users/getCategories",
  isAuthenticated,
  categoryController.getCategories
);

router.post(
  "/api/v1/users/createTransaction",
  isAuthenticated,
  transactionController.create
);

router.get(
  "/api/v1/users/getTransactions",
  isAuthenticated,
  transactionController.getFilteredTransactions
);

router.put(
  "/api/v1/users/updateTransaction/:id",
  isAuthenticated,
  transactionController.updateTransaction
);

router.delete(
  "/api/v1/users/deleteTransaction/:id",
  isAuthenticated,
  transactionController.deleteTransaction
);

module.exports = router;
