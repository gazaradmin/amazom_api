const express = require("express");

const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
} = require("../controller/books");

//  mergeParams: true => Нөгөө талаас ирсэн params-ыг хүлээж авах чадамжтай болно.
const router = express.Router({ mergeParams: true });

// /api/v1/books/
router.route("/").get(getBooks).post(createBook);
router.route("/:id").get(getBook).put(updateBook).delete(deleteBook);

module.exports = router;
