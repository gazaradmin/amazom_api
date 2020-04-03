const express = require("express");
const dotenv = require("dotenv");

// Апп-ын тохиргоог process.env рүү ачааллах
dotenv.config({ path: "./config/config.env" });
const app = express();

app.get("/", (req, res) => {
  res.send("Hello form Express server");
});

app.listen(
  process.env.PORT,
  console.log(`Express server ${process.env.PORT} портон дээр аслаа.`)
);
