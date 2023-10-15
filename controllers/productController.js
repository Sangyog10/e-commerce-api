const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

//can only use populate to get the connected reviews of the product with the things done on productSchema, it is a virtual property
//the further change needed to poppulate is done in productSchema
//alternative to it is done in reviewController
const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id }).populate(
    "reviews"
  );
  if (!product) {
    throw CustomError.NotFoundError("Product not found");
  }
  res.status(StatusCodes.OK).json(product);
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw CustomError.NotFoundError("Product not found");
  }
  res.status(StatusCodes.OK).json(product);
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw CustomError.NotFoundError("Product not found");
  }
  await product.remove(); //remove is used for triggering the pre model in schema to delete all reviews associated to it

  res.status(StatusCodes.OK).json({ msg: "product removed" });
};

const uploadImage = async (req, res) => {
  //   console.log(req.files);
  if (!req.files) {
    throw new CustomError.BadRequestError("imge not found");
  }
  const productImage = req.files.image; //name=image given in frontnd or postman
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Plz upload img");
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Plz upload img with lower resolution"
    );
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
