const Book = require("../models/Book");
const Category = require("../models/Category");
const MyError = require("../utils/MyError");
const asyncHandler = require("../middleware/asyncHandler");

// api/v1/books
// api/v1/categories/:catid/books
exports.getBooks = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.categoryId) {
    query = Book.find({ category: req.params.categoryId });
  } else {
    query = Book.find().populate({
      path: "category",
      select: "name averagePrice",
    });
  }

  const books = await query;
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById({ _id: req.params.id });

  if (!book) {
    throw new MyError(`${req.params.id} ID-тай ном байхгүй байна. `, 404);
  }

  const avg = await Book.computeCategoryAveragePrice(book.category);

  res.status(200).json({
    success: true,
    count: book.length,
    data: book,
    average: avg,
  });
});

exports.createBook = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    throw new MyError(
      `${req.body.category} ID-тэй category байхгүй байна!`,
      400
    );
  }
  const book = await Book.create(req.body);

  res.status(200).json({
    success: true,
    count: book.length,
    data: book,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    throw new MyError(`${req.params.id} ID-тэй ном байхгүй байна!`, 400);
  }
  res.status(200).json({
    success: true,
    count: book.length,
    data: book,
  });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    throw new MyError(`${req.params.id} ID-тэй ном байхгүй байна!`, 400);
  }
  book.remove();

  res.status(200).json({
    success: true,
    count: book.length,
    data: book,
  });
});
