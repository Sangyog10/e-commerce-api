const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email } = req.body;

  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new CustomError.BadRequestError("Email already exist");
  }

  const user = await User.create(req.body);

  // const tokenUser = { name: user.name, userId: user._id, role: user.role };
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Enter both email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid credential");
  }

  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    throw new CustomError.UnauthenticatedError("Invalid password");
  }
  // console.log(user._id);
  // const tokenUser = { name: user.name, userId: user._id, role: user.role };
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 5000),
  });
  res.status(StatusCodes.OK).json({ msg: "Logged out" });
};

module.exports = { register, login, logout };
