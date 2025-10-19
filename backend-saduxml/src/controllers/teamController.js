import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Team, Member } from "../db.js";
import { sendVerificationEmail } from "../utils/email.js";
import { Op } from "sequelize";

const JWT_SECRET = process.env.JWT_SECRET || "shhhhh";

export const registerTeam = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: "Missing fields" });

    const verifyToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    const verifyExpires = new Date(Date.now() + 60 * 60 * 1000);

    const team = await Team.create({ name, email, password: password, verify_token: verifyToken, verify_expires: verifyExpires, verified: false });
    sendVerificationEmail(email, verifyToken).catch((e) => console.error("Email error", e));
    return res.status(201).json({ message: "Team registered. Check email to verify.", verificationToken: verifyToken });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") return res.status(409).json({ message: "Email already registered" });
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listTeams = (req, res) => {
  const keyword = req.query.q || ''; // contoh: ?q=dwi

  Team.findAll({
    include: [
      {
        model: Member,
        attributes: ["id", "name"], // ambil kolom tertentu
      },
    ],
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
      ],
    },
  })
    .then((list) => res.json(list))
    .catch(() => res.status(500).json({ message: "Internal Server Error" }));
};

export const listMembers = async (req, res) => {
  const keyword = req.query.q || ''; // contoh: ?q=dwi

  try {
    const members = await Member.findAll({
      where: {
        [Op.or]: [
          { team_id: req.user.id },
          { name: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
        ],
      },
    })
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.user.id, {
      include: [
        {
          model: Member,
          attributes: ["id", "name"], // ambil kolom tertentu
        },
      ],
    })
    if (!team) return res.status(404).json({ message: "Not found" });
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyTeam = async (req, res) => {
  try {
    let token = req.query && req.query.token;
    if (!token) {
      const auth = req.headers.authorization || req.headers.Authorization;
      if (auth) token = auth.split(" ")[1];
    }
    if (!token) return res.status(400).json({ message: "Missing token" });

    let payload;
    try { payload = jwt.verify(token, JWT_SECRET); }
    catch (e) { if (e.name === "TokenExpiredError") return res.status(400).json({ message: "Token expired" }); else return res.status(400).json({ message: "Token invalid" }); }

    const team = await Team.findOne({ where: { email: payload.email, verify_token: token, verified: false } });
    if (!team) return res.status(400).json({ message: "Token invalid or already used" });
    if (team.verify_expires && team.verify_expires < new Date()) return res.status(400).json({ message: "Token expired" });

    team.verified = true;
    team.verify_token = null;
    team.verify_expires = null;
    await team.save();

    return res.json({ message: "Team verified" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginTeam = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });
    const team = await Team.scope("withPassword").findOne({ where: { email } });
    if (!team) return res.status(401).json({ message: "Invalid credentials" });
    if (!team.verified) return res.status(403).json({ message: "Team not verified" });
    const ok = bcrypt.compareSync(password, team.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: team.id, email, type: "team" }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addMember = async (req, res) => {
  try {
    const teamId = req.user && req.user.id;
    if (!teamId) return res.status(401).json({ message: "Not authorized" });
    const { ml_id, name, email, phone } = req.body;
    if (!ml_id || !name) return res.status(400).json({ message: "Missing fields" });
    const count = await Member.count({ where: { team_id: teamId } });
    if (count >= 5) return res.status(400).json({ message: "Team member limit reached (5)" });
    const member = await Member.create({ team_id: teamId, ml_id, name, email, phone });
    return res.status(201).json(member);
  } catch (err) {
    console.error(err);
    if (err.name === "SequelizeUniqueConstraintError") return res.status(409).json({ message: "Member unique constraint" });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
