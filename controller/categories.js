const Category = require("../models/Category");
const MyError = require("../utils/MyError");
const asyncHandler = require("../middleware/asyncHandler");

exports.getCategories = asyncHandler(async (req, res, next) => {
  // find() function нь утга дамжуулахгүй бол бүх утгыг өгнө.
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  // findById(req.params.id) function нь утга дамжуулахгүй бол бүх утгыг өгнө.

  const category = await Category.findById(req.params.id);

  if (!category) {
    // Өөрийн гэсэн алдаа цацаж байна.
    throw new MyError(req.params.id + " id -тай категори байхгүй!. ", 400);
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  console.log("data: ", req.body);

  // create() function нь өгөгдөл шинээр үүсгэнэ.

  const category = await Category.create(req.body);
  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  // new:true гэвэл хэрхэн яаж update хийгдсэн бэ гэдэг нь харагдана. runValidators нь Model дээр бичсэн шалгалтуудыг шалгаарай гэж хэлж байна.
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new MyError(req.params.id + " id -тай категори байхгүй. ", 400);
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new MyError(req.params.id + " id -тай категори байхгүй. ", 400);
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});
