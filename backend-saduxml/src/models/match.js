import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Match = sequelize.define("Match", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    group_id: { type: DataTypes.INTEGER, allowNull: true },
    team1_id: { type: DataTypes.INTEGER, allowNull: false },
    team2_id: { type: DataTypes.INTEGER, allowNull: true },
    round: { type: DataTypes.STRING(100), allowNull: true },
    match_date: { type: DataTypes.DATE, allowNull: true },
    score_team1: { type: DataTypes.INTEGER, allowNull: true },
    score_team2: { type: DataTypes.INTEGER, allowNull: true },
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
  });

  return Match;
};
