import express from "express";
import { registerTeam, verifyTeam, addMember, listTeams, getTeam, listMembers, removeMember, editMember } from "../controllers/teamController.js";
import { authMiddleware, isAdminAllowedMiddleware, isNotMemberAllowedMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.get("/", authMiddleware, isAdminAllowedMiddleware, listTeams);
router.get("/get-team", authMiddleware, getTeam);
router.get("/get-members", authMiddleware, listMembers);
router.post("/register", registerTeam);
router.get("/verify", verifyTeam);
router.post("/members", authMiddleware, isNotMemberAllowedMiddleware, addMember);
router.put("/members/:memberId", authMiddleware, isNotMemberAllowedMiddleware, editMember);
router.delete("/remove-members/:memberId", authMiddleware, isNotMemberAllowedMiddleware, removeMember);

export default router;
