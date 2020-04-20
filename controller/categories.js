const Category = require("../models/Category");

exports.getCategories = async (req, res, next) => {
  // find() function нь утга дамжуулахгүй бол бүх утгыг өгнө.
  const categories = await Category.find();
  try {
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  // findById(req.params.id) function нь утга дамжуулахгүй бол бүх утгыг өгнө.
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(400).json({
        success: false,
        error: req.params.id + " id -тай категори байхгүй. ",
      });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  console.log("data: ", req.body);

  // create() function нь өгөгдөл шинээр үүсгэнэ.

  try {
    const category = await Category.create(req.body);
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    // new:true гэвэл хэрхэн яаж update хийгдсэн бэ гэдэг нь харагдана. runValidators нь Model дээр бичсэн шалгалтуудыг шалгаарай гэж хэлж байна.
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        error: req.params.id + " id -тай категори байхгүй. ",
      });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(400).json({
        success: false,
        error: req.params.id + " id -тай категори байхгүй. ",
      });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};
