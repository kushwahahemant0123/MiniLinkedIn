import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    reactions: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        type: {
            type: String,
            enum: ['like', 'love', 'laugh', 'wow', 'sad', 'angry'],
            default: 'like'
        },
        reactedAt: {
            type: Date,
            default: Date.now
        }
    }],
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;