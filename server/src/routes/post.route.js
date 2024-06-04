const express = require("express");
const {
  createPost,
  deletepost,
  updatepost,
  getposts,
} = require("../controllers/post.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/post", verifyJwt, createPost);
router.get("/posts", getposts);
router.delete("/post/:postId/:userId", verifyJwt, deletepost);
router.patch("/post/:postId/:userId", verifyJwt, updatepost);

module.exports = router;
