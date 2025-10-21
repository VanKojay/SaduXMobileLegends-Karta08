// import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { MatchRound, Stage, Team, Member, Match } from "../db.js";
import { io } from "../app.js";
import { emitStageUpdate, emitBracketUpdate } from "../socket.js";

export const createStage = async (req, res) => {
  try {
    const { name, type, order_number, status } = req.body;
    if (!name || !order_number || !type || !status) return res.status(400).json({ message: "Missing fields" });

    await Stage.create({ name, type, order_number, status });
    return res.status(201).json({ message: "Stage created successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateStage = async (req, res) => {
  try {
    const { id } = req.params; // ambil ID dari URL params
    const { name, type, order_number, status } = req.body;

    // Validasi input
    if (!name || !order_number || !type || !status) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Cek apakah stage dengan ID tersebut ada
    const stage = await Stage.findByPk(id);
    if (!stage) {
      return res.status(404).json({ message: "Stage not found." });
    }

    // Update data
    await stage.update({
      name,
      type,
      order_number,
      status,
    });

    return res.status(200).json({
      message: "Stage updated successfully.",
      data: stage,
    });

  } catch (err) {
    console.error("Error updating stage:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteStage = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah stage ada
    const stage = await Stage.findByPk(id);
    if (!stage) {
      return res.status(404).json({ message: "Stage not found." });
    }

    // Hapus stage
    await stage.destroy();

    return res.status(200).json({ message: "Stage deleted successfully." });
  } catch (err) {
    console.error("Error deleting stage:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listStages = async (req, res) => {
  const keyword = req.query.q || '';
  const eventId = req.query.event_id || (req.user ? req.user.event_id : null);

  try {
    // Build where clause
    const whereClause = {
      [Op.and]: [
        {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
          ],
        }
      ]
    };

    // Filter by event_id if provided or if user is admin
    if (eventId) {
      whereClause[Op.and].push({ event_id: eventId });
    }

    const stageList = await Stage.findAll({
      include: [
        {
          model: MatchRound,
          as: "rounds",
          attributes: ["id", "round_number", "score_team1", "score_team2", "winner_id", 'status'],
          include: [
            {
              model: Match,
              as: "match",
              attributes: ["id", "match_date", "team1_id", "team2_id", "winner_id", "group_id", "status", "round", "score_team1", "score_team2"],
              include: [
                {
                  model: Team,
                  as: "Team1",
                  attributes: ["id", "name", "email"],
                  include: [
                    {
                      model: Member,
                      attributes: ["id", "name", "email", "ml_id", "role"],
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
                      attributes: ["id", "name", "email", "ml_id", "role"],
                    },
                  ],
                },
                {
                  model: Team,
                  as: "Winner",
                  attributes: ["id", "name", "email"],
                  include: [
                    {
                      model: Member,
                      attributes: ["id", "name", "email", "ml_id", "role"],
                    },
                  ],
                },
              ],
            },
          ]
        },
      ],
      where: whereClause,
      order: [['order_number', 'ASC']]
    })

    res.json(stageList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};