import express from "express";
import { authMiddleware, isAdminAllowedMiddleware, isNotMemberAllowedMiddleware } from "../middleware/auth.js";
import { createMatchRound, deleteMatchRound, listMatchRounds, updateMatchRound } from "../controllers/matchRoundController.js";
const router = express.Router();

router.get("/", authMiddleware, listMatchRounds);
router.post("/", authMiddleware, isAdminAllowedMiddleware, createMatchRound);
router.put("/:id", authMiddleware, isAdminAllowedMiddleware, updateMatchRound);
router.delete("/:id", authMiddleware, isAdminAllowedMiddleware, deleteMatchRound);

export default router;
