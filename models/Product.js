const { boolean, func } = require("joi");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Provide product name"],
      maxLength: 100,
    },
    price: {
      type: Number,
      default: 0,
      required: [true, "Provide product price"],
    },
    description: {
      type: String,
      required: [true, "Provide product description"],
      maxLength: 1000,
    },
    image: {
      type: String,
      default: "/upload/example.jpeg",
    },
    category: {
      type: String,
      required: true,
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: true,
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: `{VALUE} is not supported`,
      },
    },
    colors: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      default: 15,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    noOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//toJSON and toObject is used to make reviews of the product as virtual property
//with it we can see the reviews of the product

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

//for deleting all the reviews if we remove product
//remove is used in controller to delete the product
ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});

module.exports = mongoose.model("Product", ProductSchema);
