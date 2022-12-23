import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";
import { validSignUp, validSignIn } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/signup", validSignUp, signUp)
router.post("/signin", validSignIn, signIn)

export default router