import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Member = sequelize.define("Member", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    team_id: { type: DataTypes.INTEGER, allowNull: false },
    ml_id: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(191), allowNull: false },
    email: { type: DataTypes.STRING(191), allowNull: true, unique: true },
    phone: { type: DataTypes.STRING(50), allowNull: true }
  }, {
    tableName: "members",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return Member;
};
