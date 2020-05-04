const Category = require("../models/Category");
const MyError = require("../utils/MyError");
const asyncHandler = require("../middleware/asyncHandler");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 100;

  const select = req.query.select;

  const sort = req.query.sort;
  // req.query.select-s select -g ustgaj bn
  console.log(req.query, sort, select);
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  // Pagenation
  // category dotor niit hed baigaag ogno.
  const total = await Category.countDocuments();
  const pageCount = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  let end = start + limit - 1;
  if (end > total) end = total;
  const pagination = { total, pageCount, start, end, limit };
  if (page < pageCount) pagination.netxPage = page + 1;
  if (page > 1) pagination.prevPage = page - 1;

  // find() function нь утга дамжуулахгүй бол бүх утгыг өгнө.
  const categories = await Category.find(req.query, select)
    .sort(sort)
    .skip(start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: categories,
    pagination,
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
