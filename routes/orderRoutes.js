const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");
const {
  createOrder,
  getSingleOrder,
  getCurrentUserOrder,
  updateOrder,
  getAllOrders,
} = require("../controllers/orderController");

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermission, getAllOrders);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrder);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

module.exports = router;
