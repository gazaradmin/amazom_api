const express = require("express");
const { protect } = require("../middleware/protect");

const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
  uploadBookPhoto,
} = require("../controller/books");

//  mergeParams: true => Нөгөө талаас ирсэн params-ыг хүлээж авах чадамжтай болно.
// const router = express.Router({ mergeParams: true });
const router = express.Router();

// /api/v1/books/
router.route("/").get(getBooks).post(protect, createBook);
router
  .route("/:id")
  .get(getBook)
  .put(protect, updateBook)
  .delete(protect, deleteBook);
router.route("/:id/photo").put(protect, uploadBookPhoto);
module.exports = router;
