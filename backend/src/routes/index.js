import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import postRoutes from './post.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use("/profile", userRoutes);
router.use('/post', postRoutes);

export default router;