
import authenticateUser from "../middlewares/auth-middleware.js";
import express from 'express';
import validateSchema from "../middlewares/validateSchema.js";
import { createPostSchema } from "../utils/validate.js";
import { createPost, getPosts, getPostByAuther, deletePost } from "../controllers/post.js";

import { get } from "mongoose";
const router = express.Router();

router.get("/create", (req, res) => { res.json({ message: "This is a test route for posts" }) });
router.post("/create", authenticateUser, validateSchema(createPostSchema), createPost);
router.get("/author/:userId", authenticateUser, getPostByAuther);
router.delete("/:postId", authenticateUser, deletePost)

router.get("/", authenticateUser, getPosts)

export default router;