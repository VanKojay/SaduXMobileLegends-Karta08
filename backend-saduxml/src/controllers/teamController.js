import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Team, Member, Event } from "../db.js";
import { sendVerificationEmail } from "../utils/email.js";
import { Op } from "sequelize";

const JWT_SECRET = process.env.JWT_SECRET || "shhhhh";

export const registerTeam = async (req, res) => {
  try {
    const { name, email, password, event_id, leader_name, leader_phone } = req.body;
    if (!email || !password || !name || !event_id)
      return res.status(400).json({ message: "Missing fields" });

    // Ambil info event untuk validasi
    const event = await Event.findByPk(event_id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Validasi max_teams
    const teamCount = await Team.count({ where: { event_id } });
    if (teamCount >= event.max_teams) {
      return res.status(400).json({ message: `Team registration full. Max teams: ${event.max_teams}` });
    }

    // Validasi registration_deadline
    if (event.registration_deadline && new Date() > new Date(event.registration_deadline)) {
      return res.status(400).json({ message: "Registration deadline has passed" });
    }

    // Cek email sudah terdaftar
    const checkEmail = await Team.findOne({ where: { email } });
    if (checkEmail) {
      return res.status(409).json({ message: "Email already used" });
    }

    // Generate token verifikasi
    const verifyToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    const verifyExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Buat team baru
    const team = await Team.create({
      name,
      email,
      password,
      verify_token: verifyToken,
      verify_expires: verifyExpires,
      verified: false,
      leader_name,
      leader_phone,
      event_id
    });

    // Kirim email verifikasi (async)
    sendVerificationEmail(email, verifyToken).catch(e => console.error("Email error", e));

    return res.status(201).json({
      message: "Team registered. Check email to verify.",
      verificationToken: verifyToken
    });

  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError")
      return res.status(409).json({ message: "Email already registered" });

    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params; // ID team yang mau di-update
    const { name, email, password, leader_name, leader_phone } = req.body;

    const event_id = req.user.event_id

    // Validasi minimal input
    if (!name && !email && !password && !leader_name && !leader_phone && !event_id) {
      return res.status(400).json({ message: "No fields to update." });
    }

    // Cek apakah team ada
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // Jika bukan super_admin, batasi update hanya untuk event user sendiri
    if (req.user.type !== "super_admin" && team.event_id !== req.user.event_id) {
      return res.status(403).json({ message: "Not authorized to update this team." });
    }

    // Jika ingin ganti event, validasi event baru
    if (event_id && event_id !== team.event_id) {
      const event = await Event.findByPk(event_id);
      if (!event) {
        return res.status(404).json({ message: "New event not found." });
      }
    }

    // Jika ingin ganti email, pastikan belum dipakai team lain
    if (email && email !== team.email) {
      const existingEmail = await Team.findOne({
        where: {
          email,
          id: { [Op.ne]: id }, // ⛔ cari email sama tapi bukan milik team ini
        },
      });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already used by another team." });
      }
    }

    // Siapkan data yang akan diupdate
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (leader_name) updateData.leader_name = leader_name;
    if (leader_phone) updateData.leader_phone = leader_phone;
    if (event_id) updateData.event_id = event_id;

    // Jika ingin ganti password, hash dulu
    if (password) {
      const bcrypt = await import("bcryptjs");
      const salt = bcrypt.genSaltSync(10);
      updateData.password = bcrypt.hashSync(password, salt);
    }

    // Jalankan update
    await team.update(updateData);

    return res.status(200).json({
      message: "Team updated successfully.",
      data: team,
    });

  } catch (err) {
    console.error("Error updating team:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const listTeams = async (req, res) => {
  const keyword = req.query.q || ''; // contoh: ?q=dwi

  try {
    let teams = []
    if (req.user.type !== "super_admin") {
      teams = await Team.findAll({
        include: [
          {
            model: Member,
            // attributes: ["id", "name"], // ambil kolom tertentu
          },
        ],
        where: {
          event_id: req.user.event_id,
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { email: { [Op.like]: `%${keyword}%` } },
          ]
        },
      })
    } else {
      teams = await Team.findAll({
        include: [
          {
            model: Member,
            // attributes: ["id", "name"], // ambil kolom tertentu
          },
        ],
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { email: { [Op.like]: `%${keyword}%` } },
          ],
        },
      })
    }

    return res.json(teams)
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: "Internal Server Error"
    })
  }
};

export const listMembers = async (req, res) => {
  const keyword = req.query.q || ''; // contoh: ?q=dwi

  try {
    let members = []
    if (req.user.type !== "super_admin") {
      members = await Member.findAll({
        where: {
          event_id: req.user.event_id, // wajib sama dengan event user
          [Op.or]: [
            { team_id: req.user.id }, // kalau mau tetap filter team
            { name: { [Op.like]: `%${keyword}%` } },
            { email: { [Op.like]: `%${keyword}%` } },
          ],
        },
      });
    } else {
      members = await Member.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { email: { [Op.like]: `%${keyword}%` } },
          ],
        },
        order: [['event_id', 'DESC']], // sorting by event_id ascending
      });
    }

    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTeam = async (req, res) => {
  try {
    // Cek apakah kamu ingin cari by PK atau by ID dari user
    let team;

    if (req.user.id) {
      team = await Team.findByPk(req.user.id, {
        include: [
          {
            model: Member,
            // Jika ingin ambil semua kolom, tidak perlu attributes
            // Jika ingin ambil kolom tertentu, uncomment baris ini:
            // attributes: ["id", "name"],
          },
        ],
      });
    } else {
      team = await Team.findOne({
        where: { id: req.user.id },
        include: [
          {
            model: Member,
            // attributes: ["id", "name"], // opsional
          },
        ],
      });
    }

    if (!team) {
      return res.status(404).json({ message: "Not found" });
    }

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

export const addMember = async (req, res) => {
  try {
    const { id: teamId, event_id: userEventId } = req.user || {};
    const eventId = req.body.event_id || userEventId;

    if (!teamId) return res.status(401).json({ message: "Not authorized" });

    const { ml_id, name, email, phone, role, is_main_player } = req.body;
    if (!ml_id || !name) return res.status(400).json({ message: "Missing required fields: ml_id or name" });

    // Cek jumlah member di tim
    const memberCount = await Member.count({ where: { team_id: teamId, is_main_player: true } });
    if (memberCount >= 5) {
      return res.status(400).json({ message: "Pemain utama hanya bisa (5)" });
    }

    // Buat member baru
    const member = await Member.create({
      team_id: teamId,
      event_id: eventId,
      ml_id,
      name,
      email: email || null,
      phone: phone || null,
      role: role || "Gold Lane",
      is_main_player
    });

    return res.status(201).json(member);

  } catch (err) {
    console.error(err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Member already exists (unique constraint)" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const editMember = async (req, res) => {
  try {
    const teamId = req.user && req.user.id;
    if (!teamId) return res.status(401).json({ message: "Not authorized" });

    const { memberId } = req.params;
    const { ml_id, name, email, phone, role } = req.body;

    // Pastikan memberId dikirim
    if (!memberId) return res.status(400).json({ message: "Missing memberId" });
    if (!ml_id || !role || !name || !email || !phone) return res.status(400).json({ message: "Missing required fields" });

    // Cari member berdasarkan ID
    let member = [];
    if (req.user.type !== "super_admin") {
      member = await Member.findOne({ where: { id: memberId, event_id: req.user.event_id } });
    } else {
      member = await Member.findOne({ where: { id: memberId } });
    }
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Pastikan member milik tim yang sedang login
    if (member.team_id !== teamId)
      return res.status(403).json({ message: "You don't have permission to edit this member" });

    // Validasi field minimal
    if (!ml_id && !name && !email && !phone && !role)
      return res.status(400).json({ message: "Nothing to update" });

    // Update data
    if (ml_id) member.ml_id = ml_id;
    if (name) member.name = name;
    if (email) member.email = email;
    if (phone) member.phone = phone;
    if (role) member.role = role;

    await member.save();

    return res.status(200).json({ message: "Member updated successfully", member });
  } catch (err) {
    console.error(err);
    if (err.name === "SequelizeUniqueConstraintError")
      return res.status(409).json({ message: "Member unique constraint" });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const user = req.user;

    const { memberId } = req.params;
    if (!memberId) {
      return res.status(400).json({ message: "Missing member ID" });
    }

    // Cari member-nya dulu
    let member = [];
    if (user.type !== "super_admin") {
      member = await Member.findOne({ id: memberId, event_id: user.event_id });
    } else {
      member = await Member.findOne({ id: memberId });

    }

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Cek hak akses
    if (user.type === "admin") {
      // Admin bisa hapus siapa pun
      await member.destroy();
      return res.status(200).json({ message: "Member deleted by admin" });
    }

    if (user.type === "team") {
      // Team hanya boleh hapus member milik timnya sendiri
      if (member.team_id !== user.id) {
        return res.status(403).json({ message: "You can only delete members from your own team" });
      }

      await member.destroy();
      return res.status(200).json({ message: "Member deleted successfully" });
    }

    // Kalau tipe tidak dikenali
    return res.status(403).json({ message: "Unauthorized user type" });
  } catch (err) {
    console.error("RemoveMember Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
