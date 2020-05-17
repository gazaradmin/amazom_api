const express = require("express");
const { protect, authorize } = require("../middleware/protect");
const router = express.Router();

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categories");

const { getCategoryBooks } = require("../controller/books");
// /api/1v / categories;
router.route("/:categoryId/books").get(getCategoryBooks);

// const booksRouter = require("./books");
// router.use("/:categoryId/books", booksRouter);

// /api/v1/categories
router
  .route("/")
  .get(getCategories)
  .post(protect, authorize("admin"), createCategory);
router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin", "operator"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

module.exports = router;
