import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Group = sequelize.define("Group", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
  }, {
    tableName: "groups",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return Group;
};
