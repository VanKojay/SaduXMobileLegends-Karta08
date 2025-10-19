import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Event = sequelize.define("Event", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    date: { type: DataTypes.DATE, allowNull: false },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    tableName: "events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });

  return Event;
};
