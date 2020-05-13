const express = require("express");
const router = express.Router();
const { getBooks } = require("../controller/book");

// /api/v1/books/
router.route("/").get(getBooks);

module.exports = router;
