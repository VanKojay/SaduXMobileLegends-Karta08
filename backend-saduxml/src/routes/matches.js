import express from "express";
import { authMiddleware, isAdminAllowedMiddleware, isNotMemberAllowedMiddleware } from "../middleware/auth.js";
import { createMatch, deleteMatch, listMatches, updateMatch } from "../controllers/matchController.js";
const router = express.Router();

router.get("/", authMiddleware, listMatches);
router.post("/", authMiddleware, isAdminAllowedMiddleware, createMatch);
router.put("/:id", authMiddleware, isAdminAllowedMiddleware, updateMatch);
router.delete("/:id", authMiddleware, isAdminAllowedMiddleware, deleteMatch);

export default router;
