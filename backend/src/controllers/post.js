import { get } from "mongoose";
import Post from "../models/post.js"

const createPost = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const post = new Post({
            content,
            author: req.user._id,
        });

        await post.save();

        return res.status(201).json({ message: "Post is created" }, post);
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

        post.content = content;
        await post.save();

        return res.status(200).json(post);
    } catch (error) {
        console.error("Error updating post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await Post.findOneAndDelete({ _id: postId, author: post.author });

        return res.status(204).json();
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "firstName lastName profilePicture").sort({ createdAt: -1 });

        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Internal server error" });
    }


}
const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate("user", "firstName lastName profilePicture");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getPostByAuther = async (req, res) => {
    try {
        const { userId } = req.params;

        const posts = await Post.find({ author: userId }).populate("author", "firstName lastName profilePicture").sort({ createdAt: -1 });

        if (!posts) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts by author:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { createPost, updatePost, deletePost, getPostById, getPosts, getPostByAuther };