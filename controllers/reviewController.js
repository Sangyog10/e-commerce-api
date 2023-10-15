const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.BadRequestError("No product with such id found");
  }

  const reviewAlreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (reviewAlreadySubmitted) {
    throw new CustomError.BadRequestError("Review already done");
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.OK).json({ review });
};

const getAllReview = async (req, res) => {
  // const reviews = await Review.find({});
  //populate helps to get extra data from ref(product and user) declared in model and select gives the option which we want to see
  //with it we can see the details of product and user
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name",
    });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new CustomError.BadRequestError("review not found");
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new CustomError.BadRequestError("review not found");
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new CustomError.BadRequestError("review not found");
  }
  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "Review deleted" });
};

//it is alternative way of populating the single product done in productController
//it is used in productRoutes
const getSingleProductReview = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.findOne({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
