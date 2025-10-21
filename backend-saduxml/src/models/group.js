import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Group = sequelize.define("Group", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Nama grup tidak boleh kosong" },
      },
    },

    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Relasi ke event tempat grup ini berada",
    },
  }, {
    tableName: "groups",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return Group;
};
