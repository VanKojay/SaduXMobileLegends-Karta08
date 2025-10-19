import express from "express";
import { authMiddleware, isAdminAllowedMiddleware, isNotMemberAllowedMiddleware } from "../middleware/auth.js";
import { createGroup, listGroups } from "../controllers/groupController.js";
const router = express.Router();

router.get("/", authMiddleware, listGroups);
router.post("/", authMiddleware, createGroup);
// router.get("/get-group", authMiddleware, getGroup);

export default router;
