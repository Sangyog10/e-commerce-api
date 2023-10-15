const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");
const { getSingleProductReview } = require("../controllers/reviewController");

router
  .route("/")
  .post(authenticateUser, authorizePermission, createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post(authenticateUser, authorizePermission, uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermission, updateProduct)
  .delete(authenticateUser, authorizePermission, deleteProduct);

router.route("/:id/reviews").get(getSingleProductReview);

module.exports = router;
