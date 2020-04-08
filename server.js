const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
var rfs = require("rotating-file-stream"); // version 2.x
const logger = require("./middleware/logger");

// Router оруулж ирэх
const categoriesRoutes = require("./routes/categories");

// Апп-ын тохиргоог process.env рүү ачааллах
dotenv.config({ path: "./config/config.env" });

// create a rotating write stream
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

const app = express();

app.use(logger);
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/categories", categoriesRoutes);

app.listen(
  process.env.PORT,
  console.log(`Express server ${process.env.PORT} портон дээр аслаа.`)
);
