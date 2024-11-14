const mongoose = require("mongoose");
const Comment = require("../models/comment.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    //we doesn't comment our post
    if (userId !== req.user.id) {
      throw new ApiError(403, "You are not allowed to create this comment");
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    const commentWithUser = await Comment.aggregate([
      {
        $match: { _id: newComment._id },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
    ]);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { comment: commentWithUser[0] },
          "comment created successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      throw new ApiError(403, "You are not allowed to delete this comment");
    }
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { comment: deletedComment },
          "Comment has been deleted"
        )
      );
  } catch (error) {
    next(error);
  }
};

const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    // console.log("edit comment:",comment);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }
    //Only the admin who committed the post can edit it.
    if (comment.userId !== req.user._id && !req.user.isAdmin) {
      throw new ApiError(403, "You are not allowed to edit this comment");
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );

    const editedCommentWithUser = await Comment.aggregate([
      {
        $match: { _id: editedComment._id },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
    ]);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { comment: editedCommentWithUser[0] },
          "Comment has been updated"
        )
      );
  } catch (error) {
    next(error);
  }
};

const likeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    if (!comment.likes.includes(userId)) {
      // User has not liked the comment, so like it
      comment.numberOfLikes += 1;
      comment.likes.push(userId);
    } else {
      // User has already liked the comment, so unlike it
      comment.numberOfLikes -= 1;
      comment.likes = comment.likes.filter((id) => id !== userId);
    }

    await comment.save();

    const commentWithUser = await Comment.aggregate([
      {
        $match: { _id: comment._id },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { comment: commentWithUser[0] },
          "Comment like toggled successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getPostComments = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    console.log("Post ID:", postId);

    const comments = await Comment.aggregate([
      {
        $match: { postId: new mongoose.Types.ObjectId(postId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
    ]).sort({ createdAt: -1 });

    // console.log("Comments:", comments);

    if (comments.length === 0) {
      throw new ApiError(404, "Comments not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { comments },
          "Successfully retrieved post comments"
        )
      );
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getcomments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, "You are not allowed to get all comments"));

  try {
    const limit = parseInt(req.query.limit) || 5;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const commentsWithPostAndUser = await Comment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                username: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "post",
          pipeline: [
            {
              $project: {
                title: 1,
              },
            },
          ],
        },
      },
      {
        $sort: { createdAt: sortDirection },
      },
      {
        $limit: limit,
      },
    ]);

    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      comments: commentsWithPostAndUser,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  deleteComment,
  editComment,
  likeComment,
  getPostComments,
  getcomments,
};
