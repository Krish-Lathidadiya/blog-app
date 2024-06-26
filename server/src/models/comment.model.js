
const mongoose= require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true,"please provide content"],
    },
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref:"Post",
      required: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref:"User",
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;