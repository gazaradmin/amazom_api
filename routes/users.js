const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  register,
  login,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
} = require("../controller/users");

const { getUserBooks } = require("../controller/books");

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/forgot-password").post(forgotPassword);

router.use(protect);
// /api/v1/users/
router
  .route("/")
  .get(authorize("admin"), getUsers)
  .post(authorize("admin"), createUser);
router
  .route("/:id")
  .get(authorize("admin", "operator"), getUser)
  .put(authorize("admin", "operator"), updateUser)
  .delete(authorize("admin"), deleteUser);

router
  .route("/:id/books")
  .get(authorize("admin", "operator", "user"), getUserBooks);

module.exports = router;
