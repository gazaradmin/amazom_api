const User = require("../models/User");
const MyError = require("../utils/MyError");
const paginate = require("../utils/paginate");
const asyncHandler = require("../middleware/asyncHandler");

// register
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    token: user.getJsonWebToken(),
    user: user,
  });
});

// login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Оролтыг шалгана.
  if (!email || !password) {
    throw new MyError("Имэйл болон нууц үгээ оруулна уу?", 400);
  }
  // Тухайн хэрэглэгчийг хайна.
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    throw new MyError("Имэйл болон нууц үгээ зөв оруулна уу?", 401);
  }
  const ok = await user.checkPassword(password);
  if (!ok) {
    throw new MyError("Имэйл болон нууц үгээ оруулна уу?", 401);
  }

  res.status(200).json({
    success: true,
    token: user.getJsonWebToken(),
    user: user,
  });
});
