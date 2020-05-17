const errorHandler = (err, req, res, next) => {
  console.log(err.stack.cyan.underline);

  const error = { ...err };
  error.message = err.message;

  console.log(err);

  if (error.name === "CastError") {
    error.message = "Энэ ID буруу бүтэцтэй ID байна.";
    error.statusCode = 400;
  }

  // JsonWebTokenError
  if (error.name === "JsonWebTokenError" && error.message === "invalid token") {
    error.message = "Токен буруу байна.";
    error.statusCode = 400;
  }

  if (error.code === 11000) {
    error.message = "Энэ талбарын утгыг давхардуулж өгч болохгүй!.";
    error.statusCode = 400;
  }

  // err.statusCode байхгүй бол 500
  res.status(error.statusCode || 500).json({
    success: false,
    error,
  });
};

module.exports = errorHandler;
