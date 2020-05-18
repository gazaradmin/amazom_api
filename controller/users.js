const User = require("../models/User");
const MyError = require("../utils/MyError");
const paginate = require("../utils/paginate");
const asyncHandler = require("../middleware/asyncHandler");
const sendEmail = require("../utils/email");

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

exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const select = req.query.select;
  const sort = req.query.sort;
  // req.query.select-s select -g ustgaj bn
  console.log(req.query, sort, select);
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, User);

  // find() function нь утга дамжуулахгүй бол бүх утгыг өгнө.
  const users = await User.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: users,
    pagination,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    // Өөрийн гэсэн алдаа цацаж байна.
    throw new MyError(req.params.id + " id -тай хэрэглэгч байхгүй!. ", 400);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  // new:true гэвэл хэрхэн яаж update хийгдсэн бэ гэдэг нь харагдана. runValidators нь Model дээр бичсэн шалгалтуудыг шалгаарай гэж хэлж байна.
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new MyError(req.params.id + " id -тай хэрэглэгч байхгүй. ", 400);
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    throw new MyError("Та нууц үг сэргээх email хаягаа оруулна уу?", 400);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new MyError(req.body.email + " email -тэй  хэрэглэгч байхгүй. ", 400);
  }
  const resetToken = user.generatePasswordChangeToken();
  // await user.save({ validateBeforeSave: false });
  await user.save();
  const link = `https://amazon.mn/resetpassword/${resetToken}`;
  const message = `Сайн байна уу <br><br> Та нууц үгээ солих хүсэлт илгээлээ. Нууц үгээ доорх линк дээр дарэ солино уу: <br><br><a href="${link}">"${link}</a><br><br> Өдрийг сайхан өнгөрүүлээрэй.`;

  // send email
  const info = await sendEmail({
    email: user.email,
    subject: "Нууц үг өөрчлөх хүсэлт",
    message: "",
  });
  console.log("Message sent: %s", info.messageId);

  res.status(200).json({
    success: true,
    resetToken,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(req.params.id + " id -тай  хэрэглэгч байхгүй. ", 400);
  }

  user.remove();

  res.status(200).json({
    success: true,
    data: user,
  });
});
