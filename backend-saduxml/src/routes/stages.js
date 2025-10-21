import express from "express";
import { authMiddleware, isAdminAllowedMiddleware, isNotMemberAllowedMiddleware } from "../middleware/auth.js";
import { createStage, deleteStage, listStages, updateStage } from "../controllers/stageController.js";
const router = express.Router();

router.get("/", listStages);
router.post("/", authMiddleware, isAdminAllowedMiddleware, createStage);
router.put("/:id", authMiddleware, isAdminAllowedMiddleware, updateStage);
router.delete("/:id", authMiddleware, isAdminAllowedMiddleware, deleteStage);

export default router;
