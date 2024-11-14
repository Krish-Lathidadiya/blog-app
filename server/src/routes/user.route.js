const express = require("express");
const {upload}=require('../middlewares/multer.middleware');
const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const {verifyJwt}=require('../middlewares/auth.middleware');
const router = express.Router();

router.get("/user",verifyJwt ,getUsers);
router.get("/user/:userId", getUser);
router.patch("/user/:userId", upload.single('profilePicture'), updateUser);
router.delete("/user/:userId",verifyJwt, deleteUser);

module.exports = router;
