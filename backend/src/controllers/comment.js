import Comment from "../models/comment";

const createComment = async (req, res) => {
    try {
        const { postId, content } = req.body;

        if (!postId || !content) {
            return res.status(400).json({ message: "Post ID and content are required" });
        }

        const comment = new Comment({
            postId,
            user: req.user._id,
            content,
        });

        await comment.save();

        return res.status(201).json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

        comment.content = content;
        await comment.save();

        return res.status(200).json(comment);
    } catch (error) {
        console.error("Error updating comment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await comment.remove();

        return res.status(204).json();
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { createComment, updateComment, deleteComment };