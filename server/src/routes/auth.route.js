const express = require("express");
const router = express.Router();

const {
    signup,
    signin,
    signout,
    google,
} = require("../controllers/auth.controller.js");


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.post('/google', google)

module.exports = router;

