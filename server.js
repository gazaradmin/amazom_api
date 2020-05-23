const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
var rfs = require("rotating-file-stream"); // version 2.x
const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
// Router оруулж ирэх
const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
// Апп-ын тохиргоог process.env рүү ачааллах
dotenv.config({ path: "./config/config.env" });
const fileUpload = require("express-fileupload");
const app = express();

connectDB();

// create a rotating write stream
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

var whitelist = ["http://localhost:3000"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Body parser хийнэ. request-ээр орж ирж байгаа утгуудыг хүлээж авдаг.
app.use(express.json());
app.use(cors(corsOptions));
// file upload
app.use(fileUpload());

app.use(logger);
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes);
app.use(errorHandler);

const server = app.listen(
  process.env.PORT,
  console.log(`Express server ${process.env.PORT} портон дээр аслаа.`.rainbow)
);

// App даяар цацагдсан try catch хийгээгүй promise-уудыг rejex-үүдийг барьж авч байна.
process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа.: ${err.message}`.underline.red.bold);
  server.close(() => {
    // Процессыг зогсоож байна. Алдааны кодыг 1 гээд дамжуулж байна.
    process.exit(1);
  });
});
