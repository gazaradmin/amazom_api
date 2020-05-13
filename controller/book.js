const Book = require("../models/Book");
const MyError = require("../utils/MyError");
const asyncHandler = require("express-async-handler");

// api/v1/books
// api/v1/categories/:catid/books
exports.getBooks = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.categoryId) {
    query = Book.find({ category: req.params.categoryId });
  } else {
    query = Book.find();
  }

  const books = await query;
  res.status(200).json({
    success: true,
    data: books,
  });
});
