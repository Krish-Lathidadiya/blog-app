const express = require('express');
const userRoutes = require('./user.route');
const authRoutes=require('./auth.route');
const postRoutes=require('./post.route');
const commentRoutes=require('./comment.route');
const router = express.Router();

// Include user routes
router.use('/api/v1', userRoutes);
router.use('/api/v1', authRoutes);
router.use('/api/v1', postRoutes);
router.use('/api/v1', commentRoutes);

module.exports = router;
