const expressAsyncHandler = require("express-async-handler");
const Transaction = require("../model/Transaction");
const mongoose = require("mongoose");

const transactionController = {
  //!add
  create: expressAsyncHandler(async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    if (!amount || !type || !date) {
      throw new Error("Type, amount and date are required");
    }
    //! Create
    const transaction = await Transaction.create({
      user: req.user,
      type,
      category,
      amount,
      description,
      date,
    });
    res.status(201).json(transaction);
  }),

  //!lists
  getFilteredTransactions: expressAsyncHandler(async (req, res) => {
    const { startDate, endDate, type, category } = req.query;
    const userId = new mongoose.Types.ObjectId(String(req.user));
    //string to object
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    newEndDate.setHours(23, 59, 59, 999);
    const transactions = await Transaction.find({
      $and: [
        { user: userId },
        { date: { $gte: newStartDate, $lte: newEndDate } },
        { type: type },
        { category: category },
      ],
    });
    // console.log("startDate:", newStartDate);
    // console.log("endDate:", newEndDate);
    // console.log("type:", type);
    // console.log("category:", category);
    // console.log("user:", req.user);
    res.status(200).json({
      message: "Transactions fetched successfully",
      data: transactions,
    });
    // console.log(transactions);
  }),

  updateTransaction: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type, category, amount, date, description } = req.body;

    // Update the transaction directly
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, user: req.user },
      { type, category, amount, date, description },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      throw new Error("Transaction not found or unauthorized");
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  }),

  //!delete
  deleteTransaction: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user,
    });
    if (!deletedTransaction) {
      throw new Error("Transaction not found or unauthorized");
    }
    res.status(200).json({
      message: "Transaction deleted successfully",
      data: deletedTransaction,
    });
  }),
};

module.exports = transactionController;
