import express from "express";
import authenticateUser from "../middlewares/auth-middleware.js";

import {
    changePassword,
    getUserProfile,
    updateUserProfile,
} from "../controllers/user.js";

import validateSchema from "../middlewares/validateSchema.js";
import { changePasswordSchema, } from "../utils/validate.js";


const router = express.Router();

router.get("/", authenticateUser, getUserProfile);
router.put(
    "/:userId",
    authenticateUser,
    updateUserProfile
);
router.get("/test", (req, res) => {
    res.json({ message: "This is a test route for user profile" });
})

router.put(
    "/change-password",
    authenticateUser,
    validateSchema(changePasswordSchema),
    changePassword
);

export default router;