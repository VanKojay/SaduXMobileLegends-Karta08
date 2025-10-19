import { Member, Team, User } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shhhhh";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ message: "Missing fields" });

  try {
    // cek Admin
    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (user) {
      if (!user.verified) return res.status(403).json({ message: "Email not verified" });
      const ok = bcrypt.compareSync(password, user.password);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign({ id: user.id, email, type: "admin" }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token });
    }

    // cek Team
    const team = await Team.scope("withPassword").findOne({ where: { email } });
    if (team) {
      if (!team.verified) return res.status(403).json({ message: "Email not verified" });
      const ok = bcrypt.compareSync(password, team.password);
      console.log ("password:", password);
      console.log ("team.password:", team.password);
      console.log ("ok:", ok);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign({ id: team.id, email, type: "team" }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token });
    }

    // cek Member tanpa password
    const member = await Member.findOne({ where: { email }, include: [{ model: Team }] });
    if (member) {
      if (!member.Team.verified) return res.status(403).json({ message: "Email not verified" });
      const token = jwt.sign({ id: member.Team.id, id_member: member.id, email_member: email, type: "member" }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token });
    }

    // kalau tidak ada
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

