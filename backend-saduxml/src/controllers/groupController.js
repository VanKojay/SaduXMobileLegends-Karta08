// import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { Group, GroupTeam, Member, Team } from "../db.js";

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Missing fields" });

    await Group.create({ name });
    return res.status(201).json({ message: "Group created successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listGroups = async (req, res) => {
  const keyword = req.query.q || ''; // contoh: ?q=dwi

  try {
    const groupList = await Group.findAll({
      include: [
        {
          model: GroupTeam,
          attributes: ["id", "team_id", "group_id"], // ambil kolom tertentu
          include: [
            {
              model: Team,
              attributes: ["id", "name", "email"], // kolom Team yang mau diambil
              include: [
                {
                  model: Member,
                  attributes: ["id", "name", "email"], // kolom Team yang mau diambil
                },
              ],
            },
          ],
        },
      ],
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
        ],
      },
    })

    res.json(groupList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};