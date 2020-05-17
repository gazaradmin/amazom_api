const Book = require("../models/Book");
const User = require("../models/User");
const path = require("path");
const Category = require("../models/Category");
const MyError = require("../utils/MyError");
const paginate = require("../utils/paginate");
const asyncHandler = require("../middleware/asyncHandler");

// api/v1/books
exports.getBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const select = req.query.select;
  const sort = req.query.sort;
  // req.query.select-s select -g ustgaj bn
  // console.log(req.query, sort, select);
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, Book);

  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

// api/v1/categories/:catid/books
exports.getCategoryBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const select = req.query.select;
  const sort = req.query.sort;
  // req.query.select-s select -g ustgaj bn
  console.log(req.query, sort, select);
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, Book);

  // req.query, select
  const books = await Book.find(
    { ...req.query, category: req.params.categoryId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById({ _id: req.params.id });

  if (!book) {
    throw new MyError(`${req.params.id} ID-тай ном байхгүй байна. `, 404);
  }

  res.status(200).json({
    success: true,
    count: book.length,
    data: book,
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
  req.body.createUser = req.userId;
  const book = await Book.create(req.body);

  res.status(200).json({
    success: true,
    count: book.length,
    data: book,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  req.body.updateUser = req.userId;

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

//PUT: api/v1/books/:id/photo
exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id, req.body);
  if (!book) {
    throw new MyError(`${req.params.id} ID-тэй ном байхгүй байна!`, 400);
  }

  // image upload
  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү", 400);
  }

  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
    throw new MyError("Таны зурагны хэмжээ хэтэрсэн байна.", 400);
  }
  // path.parse(file.name).ext- file-ын нэрийг задлаад extension-ыг нь авна.
  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа: " + err.message,
        400
      );
    }
    // book-ын photo талбарт утга өгч хадгалж байна.
    book.photo = file.name;
    book.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    throw new MyError(`${req.params.id} ID-тэй ном байхгүй байна!`, 400);
  }
  book.remove();
  const user = await User.findById(req.userId);

  res.status(200).json({
    success: true,
    count: book.length,
    data: book,
    deleteUserID: req.userId,
    whoDeleted: user,
  });
});
