import { Router } from "express";
import { usersMe, usersRanking } from "../controllers/userController.js";
import { hasToken } from "../middlewares/tokenMiddleware.js";


const router = Router()

router.get("/users/me", hasToken, usersMe)
router.get("/ranking", usersRanking)

export default router