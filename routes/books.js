const express = require("express");

//  mergeParams: true => Нөгөө талаас ирсэн params-ыг хүлээж авах чадамжтай болно.
const router = express.Router({ mergeParams: true });
const { getBooks } = require("../controller/books");

// /api/v1/books/
router.route("/").get(getBooks);

module.exports = router;
