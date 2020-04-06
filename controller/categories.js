exports.getCategories = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "Бүх категориудыг энд өгнө......",
  });
};

exports.getCategory = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: `${req.params.id} -ID-тай Категорийн мэдээллийг өгнө.`,
  });
};

exports.createCategory = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "Шинэ категори үүсгэх",
  });
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
