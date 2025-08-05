import User from "../models/user.js";
import Verification from "../models/verification.js";
import { sendEmail } from "../utils/send-email.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const registerUser = async (req, res) => {

    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const profilePicture = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=0D8ABC&color=fff`;

        const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            profilePicture,

        });

        const verificationToken = jwt.sign({
            userId: newUser._id, purpose: "email-verification"
        },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        await Verification.create({
            userId: newUser._id,
            token: verificationToken,
            expiresAt: (Date.now() + 3600000) // 1 hour
        });
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
        const emailSubject = "Verify your email";

        const isEmailSent = await sendEmail(email, emailSubject, emailBody);
        if (!isEmailSent) {
            return res.status(500).json({ message: "Failed to send verification email" });
        }

        return res.status(201).json({ message: "Verification email sent to your email. Please check and verify your account." });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.isEmailVerified) {
            const existingVerification = await Verification.findOne({ userId: user._id });

            if (existingVerification && existingVerification.expiresAt > new Date()) {
                return res.status(400).json({
                    message: "Email not verified. Please check your email for the verification link."
                });
            } else {
                if (existingVerification) {
                    await Verification.findByIdAndDelete(existingVerification._id);
                }

                const verificationToken = jwt.sign(
                    { userId: user._id, purpose: "email-verification" },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );

                await Verification.create({
                    userId: user._id,
                    token: verificationToken,
                    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
                });

                const verificationLink = `${process.env.FRONTEND_URL}/verify-email-?token=${verificationToken}`;
                const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
                const emailSubject = "Verify your email";

                const isEmailSent = await sendEmail(email, emailSubject, emailBody);

                if (!isEmailSent) {
                    return res.status(500).json({ message: "Failed to send verification email" });
                }

                return res.status(201).json({ message: "Verification email sent to your email. Please check and verify your account." });
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, purpose: "login" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        user.lastLogin = new Date();
        await user.save();

        const userData = user.toObject();
        delete userData.password;

        return res.status(200).json({
            message: "Login successful",
            token,
            user: userData,
        });

    } catch (err) {
        console.log(err);

        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        const paylod = jwt.verify(token, process.env.JWT_SECRET);

        if (!paylod) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { userId, purpose } = paylod;

        if (purpose !== "email-verification") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const verification = await Verification.findOne({
            userId, token
        });

        if (!verification) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const isTokenExpired = verification.expiresAt < new Date();

        if (isTokenExpired) {
            return res.status(401).json({ message: "Token expired" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }
        user.isEmailVerified = true;
        await user.save();

        await Verification.findByIdAndDelete(verification._id);

        res.status(200).json({ message: "Email verfication successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { registerUser, loginUser, verifyEmail };