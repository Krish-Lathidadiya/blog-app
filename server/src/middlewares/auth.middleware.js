const { ApiError } = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("accessToken:",token);
    if (!token) {
      throw new ApiError(400, "Unauthorized access request");
    }

    let decoded;
    try {
      decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(401, "Access token has expired");
      } else {
        throw new ApiError(400, "Invalid access token");
      }
    }

    const user = await User.findById(decoded._id).select("-password");
    console.log("verify user:", user);
    if (!user) {
      throw new ApiError(400, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyJwt };
