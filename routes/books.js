const express = require("express");
const { protect, authorize } = require("../middleware/protect");

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
router
  .route("/")
  .get(getBooks)
  .post(protect, authorize("admin", "operator"), createBook);
router
  .route("/:id")
  .get(getBook)
  .put(protect, authorize("admin", "operator"), updateBook)
  .delete(protect, authorize("admin", "operator"), deleteBook);
router
  .route("/:id/photo")
  .put(protect, authorize("admin", "operator"), uploadBookPhoto);
module.exports = router;
