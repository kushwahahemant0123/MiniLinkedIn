
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    bio: {
        type: String,
        default: "Hi! I'm new here. Let's connect and learn together."
    },

    password: {
        type: String,
        required: true,
        select: false,
    },
    profilePicture: {
        type: String,

    },
    isEmailVerified: {
        type: Boolean, default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now(),
    },
    connections: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }, connectedAt: {
            type: Date,
            default: Date.now
        }
    }],
}, { timestamps: true });

const User = new mongoose.model("User", userSchema);

export default User;