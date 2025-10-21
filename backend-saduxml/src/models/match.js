import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Match = sequelize.define("Match", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    // 🔗 Integrasi dengan event & stage
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Relasi ke event tempat pertandingan ini berada",
    },
    stage_id: { type: DataTypes.INTEGER, allowNull: true },
    group_id: { type: DataTypes.INTEGER, allowNull: true },

    // 🔗 Tim yang bertanding
    team1_id: { type: DataTypes.INTEGER, allowNull: false },
    team2_id: { type: DataTypes.INTEGER, allowNull: true },

    round: { type: DataTypes.STRING(100), allowNull: true },
    match_date: { type: DataTypes.DATE, allowNull: true },

    // ⚔️ Skor dan hasil
    score_team1: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [0], msg: "Skor tidak boleh negatif" },
      },
    },
    score_team2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [0], msg: "Skor tidak boleh negatif" },
      },
    },

    winner_id: { type: DataTypes.INTEGER, allowNull: true },

    status: {
      type: DataTypes.ENUM("pending", "ongoing", "finished"),
      defaultValue: "pending",
    },
  }, {
    tableName: "matches",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    validate: {
      notSameTeam() {
        if (this.team1_id && this.team2_id && this.team1_id === this.team2_id) {
          throw new Error("Team 1 dan Team 2 tidak boleh sama");
        }
      },
    },
  });

  return Match;
};
