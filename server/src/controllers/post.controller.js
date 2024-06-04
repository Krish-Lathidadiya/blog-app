const Post = require("../models/post.model.js");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const createPost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new ApiError(403, "You are not allowed to create a post");
    }
    if (!req.body.title) {
      throw new ApiError(400, "Please Provide Title");
    }
    if (!req.body.content) {
      throw new ApiError(400, "Please Provide Content");
    }
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
    });

    const savedPost = await newPost.save();
    res
      .status(200)
      .json(
        new ApiResponse(200, { post: savedPost }, "post saved successfully")
      );
  } catch (error) {
    next(error);
  }
};

const deletepost = async (req, res, next) => {
  try {
    //we doesn't delete other user post we delete our post only & admin can delete out post
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      throw new ApiError(403, "You are not allowed to delete this post");
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json(new ApiResponse(200, {}, "The post has been deleted"));
  } catch (error) {
    next(error);
  }
};

const updatepost = async (req, res, next) => {
  try {
    const { title, content, category, image } = req.body;

    //we doesn't update other user post we update our post only & admin can update out post
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this post"));
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) updateData.category = category;
    if (image) updateData.image = image;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: updateData },
      { new: true }
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, { post: updatedPost }, "The post has been updated")
      );
  } catch (error) {
    next(error);
  }
};


const getposts = async (req, res, next) => {
  try {
    console.log("req.query",req.query);
    const limit = parseInt(req.query.limit) || 5;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const filter = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    const posts = await Post.find(filter)
      .sort({ updatedAt: sortDirection })
      .limit(limit);

    const totalPosts = await Post.countDocuments(filter);

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      status: 200,
      data: {
        posts,
        totalPosts,
        lastMonthPosts,
      },
      message: "Posts fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, deletepost, updatepost, getposts };
