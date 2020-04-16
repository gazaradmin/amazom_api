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
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};

exports.getCategory = async (req, res, next) => {
  // findById(req.params.id) function нь утга дамжуулахгүй бол бүх утгыг өгнө.
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      res.status(200).json({
        success: true,
        data: category,
      });
    } else {
      res.status(400).json({
        success: false,
        error: req.params.id + " id -тай категори байхгүй. ",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
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
    console.log("exports.createCategory -> error", err);
    res.status(400).json({
      success: false,
      error: err,
    });
  }
};

exports.updateCategory = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: `${req.params.id} Шинэ категори өөрчлөх`,
  });
};

exports.deleteCategory = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: `${req.params.id} -ID-тай категорийг устгалаа.`,
  });
};
