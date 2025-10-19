import express from "express";
import { createEvent, listEvents, getEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.get("/", listEvents);
router.get("/:id", getEvent);
router.post("/", authMiddleware, createEvent);
router.put("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
