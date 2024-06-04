const express = require("express");
const {
    createComment,
    deleteComment,
    editComment,
    likeComment,
    getPostComments,
    getcomments,
} = require("../controllers/comment.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/comment",verifyJwt ,createComment);
router.delete("/comment/:commentId",verifyJwt ,deleteComment);
router.patch("/comment/:commentId",verifyJwt ,editComment);
router.post("/comment/:commentId",verifyJwt ,likeComment);
router.get("/comment/:postId",getPostComments);
router.get("/comment",verifyJwt,getcomments);

module.exports = router;
