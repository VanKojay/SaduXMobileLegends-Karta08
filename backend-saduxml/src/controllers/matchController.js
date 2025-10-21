// import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { Match, Team, Member, Stage } from "../db.js";

export const createMatch = async (req, res) => {
  try {
    const { group_id, team1_id, team2_id, winner_id, match_date, status, score_team1, score_team2, stage_id } = req.body;
    if (!team1_id || !match_date || !status) return res.status(400).json({ message: "Missing fields" });

    if (req.user.type !== "super_admin") {
      await Match.create({ group_id, team1_id, team2_id, winner_id, match_date, status, score_team1, score_team2, stage_id, event_id: req.user.event_id });
    } else {
      await Match.create({ group_id, team1_id, team2_id, winner_id, match_date, status, score_team1, score_team2, stage_id, event_id: req.body.event_id });
    }
    return res.status(201).json({ message: "Match created successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      group_id,
      team1_id,
      team2_id,
      match_date,
      status,
      winner_id,
      stage_id
    } = req.body;

    // Cek apakah match ada
    let match = []
    if (req.user.type !== "super_admin") {
      match = await Match.findOne({
        id,
        event_id: req.user.event_id
      });
    } else {
      match = await Match.findOne({
        id
      });
    }
    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    // Validasi tim
    if (team1_id && team2_id && team1_id === team2_id) {
      return res.status(400).json({ message: "Team1 and Team2 cannot be the same." });
    }

    // Update match
    await match.update({
      group_id: group_id ?? match.group_id,
      team1_id: team1_id ?? match.team1_id,
      team2_id: team2_id ?? match.team2_id,
      match_date: match_date ?? match.match_date,
      status: status ?? match.status,
      winner_id: winner_id ?? match.winner_id,
      stage_id: stage_id ?? match.stage_id,
    });

    return res.status(200).json({
      message: "Match updated successfully.",
      data: match,
    });
  } catch (err) {
    console.error("Error updating match:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah match ada
    let match = []
    if (req.user.type !== "super_admin") {
      match = await Match.findOne({
        id,
        event_id: req.user.event_id
      });
    } else {
      match = await Match.findOne({
        id
      });
    }
    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    // Hapus match
    await match.destroy();

    return res.status(200).json({ message: "Match deleted successfully." });
  } catch (err) {
    console.error("Error deleting match:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listMatches = async (req, res) => {
  const keyword = req.query.q || ''; // contoh: ?q=final

  try {
    let matchList = []
    if (req.user.type !== "super_admin") {
      matchList = await Match.findAll({
        include: [
          {
            model: Team,
            as: "Team1",
            attributes: ["id", "name", "email"],
            include: [
              {
                model: Member,
                attributes: ["id", "name", "email"],
              },
            ],
          },
          {
            model: Team,
            as: "Team2",
            attributes: ["id", "name", "email"],
            include: [
              {
                model: Member,
                attributes: ["id", "name", "email"],
              },
            ],
          },
          {
            model: Team,
            as: "Winner",
            attributes: ["id", "name", "email"],
          },
          {
            model: Stage,
            attributes: ["id", "name", "type", "order_number", "status"],
          },
        ],
        where: {
          [Op.or]: [
            { '$Team1.name$': { [Op.like]: `%${keyword}%` } },
            { '$Team2.name$': { [Op.like]: `%${keyword}%` } },
          ],
        },
        order: [['match_date', 'ASC']],
      });
    } else {
      matchList = await Match.findAll({
        include: [
          {
            model: Team,
            as: "Team1",
            attributes: ["id", "name", "email"],
            include: [
              {
                model: Member,
                attributes: ["id", "name", "email"],
              },
            ],
          },
          {
            model: Team,
            as: "Team2",
            attributes: ["id", "name", "email"],
            include: [
              {
                model: Member,
                attributes: ["id", "name", "email"],
              },
            ],
          },
          {
            model: Team,
            as: "Winner",
            attributes: ["id", "name", "email"],
          },
          {
            model: Stage,
            attributes: ["id", "name", "type", "order_number", "status"],
          },
        ],
        where: {
          [Op.or]: [
            { '$Team1.name$': { [Op.like]: `%${keyword}%` } },
            { '$Team2.name$': { [Op.like]: `%${keyword}%` } },
          ],
        },
        order: [['match_date', 'ASC']],
      });
    }

    res.json(matchList);
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};