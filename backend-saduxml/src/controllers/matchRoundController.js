// import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { MatchRound, Stage, Team, Member, Match } from "../db.js";

export const createMatchRound = async (req, res) => {
  try {
    const {
      match_id,
      stage_id, // nullable
      round_number,
      score_team1,
      score_team2,
      winner_id,
      status, // pending | ongoing | finished
    } = req.body;

    // ✅ Validasi field wajib
    if (!match_id || !round_number) {
      return res.status(400).json({ message: "match_id dan round_number wajib diisi." });
    }

    // ✅ Cek apakah Match ada
    const match = await Match.findByPk(match_id);
    if (!match) {
      return res.status(404).json({ message: "Match tidak ditemukan." });
    }

    // ✅ Jika stage_id diisi, pastikan valid
    let stage = [];
    if (stage_id) {
      stage = await Stage.findByPk(stage_id);
      if (!stage) {
        return res.status(404).json({ message: "Stage tidak ditemukan." });
      }
    }

    if (round_number > stage.best_of) {
      return res.status(500).json({
        message: "Round exceeds limit",
      })
    }

    // ✅ Buat MatchRound baru
    let newRound = []
    if (req.user.type !== "super_admin") {
      newRound = await MatchRound.create({
        match_id,
        stage_id: stage_id || null,
        round_number,
        score_team1: score_team1 || 0,
        score_team2: score_team2 || 0,
        winner_id: winner_id || null,
        status: status || "pending",
        event_id: req.user.event_id
      });
    } else {
      newRound = await MatchRound.create({
        match_id,
        stage_id: stage_id || null,
        round_number,
        score_team1: score_team1 || 0,
        score_team2: score_team2 || 0,
        winner_id: winner_id || null,
        status: status || "pending",
        event_id: req.body.event_id
      });
    }

    // ✅ Ambil ulang lengkap dengan relasi (biar respons langsung komplit)
    const createdRound = await MatchRound.findByPk(newRound.id, {
      include: [
        {
          model: Match,
          attributes: ["id", "match_date", "status"],
        },
        {
          model: Stage,
          attributes: ["id", "name", "type"],
        },
      ],
    });

    return res.status(201).json({
      message: "Match round berhasil dibuat.",
      data: createdRound,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateMatchRound = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      match_id,
      stage_id,
      round_number,
      score_team1,
      score_team2,
      winner_id,
      status,
    } = req.body;

    // 🔹 Cek apakah MatchRound ada
    let matchRound = []
    if (req.user.type !== "super_admin") {
      matchRound = await MatchRound.findOne({
        id,
        event_id: req.user.event_id
      });
    } else {
      matchRound = await MatchRound.findOne({
        id
      });
    }

    if (!matchRound) {
      return res.status(404).json({ message: "Match Round not found." });
    }

    // 🔹 Validasi match_id (kalau dikirim)
    if (match_id) {
      const match = await Match.findByPk(match_id);
      if (!match) {
        return res.status(400).json({ message: "Invalid match_id: Match not found." });
      }
    }

    // 🔹 Validasi stage_id (kalau dikirim dan tidak null)
    let stage = []
    if (stage_id) {
      stage = await Stage.findByPk(stage_id);
      if (!stage) {
        return res.status(400).json({ message: "Invalid stage_id: Stage not found." });
      }
    }

    if (round_number > stage.best_of) {
      return res.status(500).json({
        message: "Round exceeds limit",
      })
    }

    // 🔹 Update data ronde
    await matchRound.update({
      match_id: match_id ?? matchRound.match_id,
      stage_id: stage_id ?? matchRound.stage_id,
      round_number: round_number ?? matchRound.round_number,
      score_team1: score_team1 ?? matchRound.score_team1,
      score_team2: score_team2 ?? matchRound.score_team2,
      winner_id: winner_id ?? matchRound.winner_id,
      status: status ?? matchRound.status,
    });

    return res.status(200).json({
      message: "Match Round updated successfully.",
      data: matchRound,
    });
  } catch (err) {
    console.error("Error updating Match Round:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteMatchRound = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Cek apakah ronde ada
    let matchRound = [];
    if (req.user.type !== "super_admin") {
      matchRound = await MatchRound.findOne({
        id,
        event_id: req.user.event_id
      });
    } else {
      matchRound = await MatchRound.findOne({id});
    }
    if (!matchRound) {
      return res.status(404).json({ message: "Match Round not found." });
    }

    // 🔹 Hapus ronde
    await matchRound.destroy();

    return res.status(200).json({
      message: "Match Round deleted successfully."
    });
  } catch (err) {
    console.error("Error deleting Match Round:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listMatchRounds = async (req, res) => {
  const keyword = req.query.q || ''; // contoh: ?q=dwi

  try {
    let matchRounds = [];
    if (req.user.type !== "super_admin") {
      matchRounds = await MatchRound.findAll({
        attributes: ["id", "round_number", "score_team1", "score_team2", "winner_id", "status"],
        include: [
          {
            model: Stage,
            attributes: ["id", "name", "type", "order_number", "status"],
            where: {
              name: { [Op.like]: `%${keyword}%` },
            },
            required: false, // biar nggak error kalau nggak ada Stage
          },
          {
            model: Match,
            attributes: ["id", "match_date", "team1_id", "team2_id", "winner_id", "group_id", "status", "round"],
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
                include: [
                  {
                    model: Member,
                    attributes: ["id", "name", "email"],
                  },
                ],
              },
            ],
          },
        ],
        where: {
          event_id: req.user.event_id
        },
        order: [["round_number", "ASC"]],
      });
    } else {
      matchRounds = await MatchRound.findAll({
        attributes: ["id", "round_number", "score_team1", "score_team2", "winner_id", "status"],
        include: [
          {
            model: Stage,
            attributes: ["id", "name", "type", "order_number", "status"],
            where: {
              name: { [Op.like]: `%${keyword}%` },
            },
            required: false, // biar nggak error kalau nggak ada Stage
          },
          {
            model: Match,
            attributes: ["id", "match_date", "team1_id", "team2_id", "winner_id", "group_id", "status", "round"],
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
                include: [
                  {
                    model: Member,
                    attributes: ["id", "name", "email"],
                  },
                ],
              },
            ],
          },
        ],
        order: [["round_number", "ASC"]],
      });
    }

    res.json(matchRounds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};