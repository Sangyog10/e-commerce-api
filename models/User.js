const mongoose = require("mongoose");
const validator = require("validator"); //used for email validation
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ["Please provide name"]],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    requried: [true, ["Please provide email"]],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, ["Please provide password"]],
    minlength: 5,
  },
  role: {
    type: String,
    emum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths()); //kun modify vayo user update garda
  // console.log(this.isModified('name'));
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
