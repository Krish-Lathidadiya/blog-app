const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const bcrypt = require("bcrypt");

const updateUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    let profilePictureUrl;
    if (req.file) {
      const profilePictureLocalPath = req.file.path;
      profilePictureUrl = await uploadOnCloudinary(profilePictureLocalPath);
      if (!profilePictureUrl) {
        throw new ApiError(
          400,
          "Error uploading profile picture to Cloudinary"
        );
      }
    }

    const updateData = {};
    if (username) updateData.username = username.toLowerCase();
    if (email) updateData.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    if (profilePictureUrl) updateData.profilePicture = profilePictureUrl.url;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw new ApiError(500, "Failed to update user");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { user: updatedUser }, "User updated successfully")
      );
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    // Check if the requesting user is an admin
    if (!req.user.isAdmin) {
      throw new ApiError(403, "You are not allowed to see all users");
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { users, totalUsers, lastMonthUsers },
          "User data retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      throw new ApiError(404, "user not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, { user }, "user get successfully"));
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if the requester is an admin
    if (!req.user.isAdmin && req.user._id !== req.params.userId) {
      throw new ApiError(403, "You are not allowed to delete this user");
    }

    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, getUsers, updateUser, deleteUser };
