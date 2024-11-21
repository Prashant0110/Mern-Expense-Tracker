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
    console.log(req.user);
    const categories = await Category.find({ user: req.user });

    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  }),
  //updateCategory
  updateCategory: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;
    if (!name || !type) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }

    const categoryName = name.toLowerCase();
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

    // Update category
    const categoryItems = await Category.findOneAndUpdate(
      { _id: id, user: req.user },
      { name: categoryName, type: type },
      { new: true, runValidators: true }
    );

    // Check if the name has changed and update related transactions
    await Transaction.updateMany(
      {
        user: req.user._id,
        category: categoryItems.name, // old category name
      },
      { $set: { category: categoryName } } // new category name
    );

    res.status(200).json({
      message: "Category and related transactions updated successfully",
      data: categoryItems,
    });
  }),

  // //deleteCategory
  deleteCategory: expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    // Step 1: Find and delete related transactions first.
    const categoryToDelete = await Category.findOne({
      _id: id,
      user: req.user,
    });
    if (!categoryToDelete) {
      res.status(404);
      throw new Error("Category not found or unauthorized");
    }

    // Step 2: Delete related transactions by category name
    await Transaction.deleteMany({
      category: categoryToDelete.name,
      user: req.user,
    });

    // Step 3: Now that transactions are deleted, delete the category.
    const deletedCategory = await Category.findOneAndDelete({
      _id: id,
      user: req.user,
    });
    if (!deletedCategory) {
      res.status(404);
      throw new Error("Category not found or unauthorized");
    }

    // Step 4: Return a success message
    res.status(200).json({
      message: "Category and related transactions deleted successfully",
    });
  }),
};

module.exports = categoryController;
