const expressAsyncHandler = require("express-async-handler");
const Category = require("../model/Category");

const categoryController = {
  //Register User
  createCategory: expressAsyncHandler(async (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }

    const categoryName = name.toLowerCase();
    //to check valid types enum
    const validData = ["income", "expense"];
    if (!validData.includes(type.toLowerCase())) {
      res.status(400);
      throw new Error("Invalid type");
    }

    const categoryExists = await Category.findOne({
      name: categoryName,
      user: req.user,
    });
    if (categoryExists) {
      res.status(400);
      throw new Error("Category already exists");
    }

    //create category
    const categoryItems = await Category.create({
      name: categoryName,
      type: type,
      user: req.user,
    });
    res.status(200).json({
      message: "Category created successfully",
      data: categoryItems,
    });
  }),

  getCategories: expressAsyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user });
    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  }),

  //   updateCategory: expressAsyncHandler(async (req, res) => {
  // };
};

module.exports = categoryController;
