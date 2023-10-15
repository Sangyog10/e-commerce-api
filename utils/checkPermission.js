const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  //   console.log(requestUser);
  //   console.log(resourceUserId);
  //   console.log(typeof resourceUserId);
  if (requestUser.role === "admin") return; //admin can access anything
  if (requestUser.userId === resourceUserId.toString()) return; //same person accesssign own profile
  throw new CustomError.UnauthorizedError("Access denied");
};

module.exports = { checkPermissions };
