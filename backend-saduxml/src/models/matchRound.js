import { DataTypes } from "sequelize";

export default (sequelize) => {
  const MatchRound = sequelize.define(
    "MatchRound",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      // 🔗 Integrasi dengan event dan match
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Relasi ke event tempat ronde ini berada",
      },
      match_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Relasi ke match induk",
      },
      stage_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      round_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [1], msg: "Nomor ronde minimal 1" },
        },
      },

      // ⚔️ Skor & hasil
      score_team1: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: { args: [0], msg: "Skor tidak boleh negatif" },
        },
      },
      score_team2: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: { args: [0], msg: "Skor tidak boleh negatif" },
        },
      },
      winner_id: { type: DataTypes.INTEGER, allowNull: true },

      status: {
        type: DataTypes.ENUM("pending", "ongoing", "finished"),
        defaultValue: "pending",
      },

      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "match_rounds",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return MatchRound;
};
