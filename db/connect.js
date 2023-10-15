const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(url);
};
mongoose.set("strictQuery", false); // For Mongoose 7 deprecation warning

module.exports = connectDB;
