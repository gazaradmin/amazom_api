const express = require("express");
const dotenv = require("dotenv");

// Router оруулж ирэх
const categoriesRoutes = require("./routes/categories");

// Апп-ын тохиргоог process.env рүү ачааллах
dotenv.config({ path: "./config/config.env" });
const app = express();

// middleware холбож байна.
app.use("/api/v1/categories", categoriesRoutes);

app.listen(
  process.env.PORT,
  console.log(`Express server ${process.env.PORT} портон дээр аслаа.`)
);
