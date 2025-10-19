import { DataTypes } from "sequelize";

export default (sequelize) => {
  const GroupTeam = sequelize.define("GroupTeam", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    group_id: { type: DataTypes.INTEGER, allowNull: false },
    team_id: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    tableName: "group_teams",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return GroupTeam;
};