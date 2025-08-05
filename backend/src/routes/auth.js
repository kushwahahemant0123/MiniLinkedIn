import express from "express";
import validateSchema from "../middlewares/validateSchema.js";
import { loginSchema, registerSchema } from "../utils/validate.js";
import { loginUser, registerUser, verifyEmail } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", validateSchema(registerSchema), registerUser);

router.get("/register", (req, res) => {
    res.status(200).json({ message: "welcome to the register page" });
});

router.post("/login", validateSchema(loginSchema), loginUser);

router.post("/verify-email", verifyEmail);
router.get("/welcome", (req, res) => {
    res.json({ message: "Hello welcome to the mini linkedin" });
})

export default router;
