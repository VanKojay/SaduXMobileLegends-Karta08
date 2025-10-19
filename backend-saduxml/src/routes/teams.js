import express from "express";
import { registerTeam, verifyTeam, loginTeam, addMember, listTeams, getTeam, listMembers } from "../controllers/teamController.js";
import { authMiddleware, isAdminAllowedMiddleware, isNotMemberAllowedMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.get("/", authMiddleware, isAdminAllowedMiddleware, listTeams);
router.get("/get-team", authMiddleware, getTeam);
router.get("/get-members", authMiddleware, listMembers);
router.post("/register", registerTeam);
router.get("/verify", verifyTeam);
router.post("/login", loginTeam);
router.post("/members", authMiddleware, isNotMemberAllowedMiddleware, addMember);

export default router;
