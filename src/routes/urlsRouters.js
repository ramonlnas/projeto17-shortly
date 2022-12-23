import { Router } from "express";
import {
  postShorten,
  getUrlById,
  getOpenUrl,
  deletUrlById,
} from "../controllers/urlController.js";
import { hasToken } from "../middlewares/tokenMiddleware.js";
import { validPostShorten } from "../middlewares/urlsMiddlewares.js";
const router = Router();

router.post("/urls/shorten", hasToken, validPostShorten, postShorten);
router.get("/urls/:id", getUrlById);
router.get("/urls/open/:shortUrl", getOpenUrl);
router.delete("/urls/:id", hasToken, deletUrlById);

export default router;
