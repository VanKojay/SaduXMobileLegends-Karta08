import { Member, Team, User } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shhhhh";

export const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password || null;
  if (!email) return res.status(400).json({ message: "Missing fields" });
  try {
    if (!password) {
      const member = await Member.findOne({ where: { email }, include: [{ model: Team }] });
      if (!member) return res.status(401).json({ message: "Invalid credentials" });
      if (!member.Team.verified) return res.status(403).json({ message: "Email not verified" });
      const token = jwt.sign({ id: member.Team.id, id_member: member.id, email_member: email, type: "member" }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token });
    }
    const user = await User.scope("withPassword").findOne({ where: { email } })
    if (user == null) {
      const team = await Team.scope("withPassword").findOne({ where: { email } });
      if (!team) return res.status(401).json({ message: "Invalid credentials" });
      if (!team.verified) return res.status(403).json({ message: "Email not verified" });
      const ok = bcrypt.compareSync(password, team.password);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign({ id: team.id, email, type: "team" }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token });
    }
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.verified) return res.status(403).json({ message: "Email not verified" });
    console.log("password:", password);
    console.log("user.password:", user.password);
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, email, type: "admin" }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
