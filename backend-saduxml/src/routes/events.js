import express from "express";
import { createEvent, listEvents, getEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { authMiddleware, isAdminAllowedMiddleware, isNotMemberAllowedMiddleware, isSuperAdminAllowedMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.get("/", listEvents);
router.get("/:id", authMiddleware, getEvent);
router.post("/", authMiddleware, isSuperAdminAllowedMiddleware, createEvent);
router.put("/:id", authMiddleware, isSuperAdminAllowedMiddleware, updateEvent);
router.delete("/:id", authMiddleware, isSuperAdminAllowedMiddleware, deleteEvent);

export default router;
