import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Member = sequelize.define(
    "Member",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Relasi ke event tempat member ini bertanding",
        validate: {
          notEmpty: { msg: "Event ID tidak boleh kosong" },
        },
      },

      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Team ID tidak boleh kosong" },
        },
      },

      ml_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: "ID Mobile Legends player",
        validate: {
          notEmpty: { msg: "ML ID tidak boleh kosong" },
        },
      },

      name: {
        type: DataTypes.STRING(191),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Nama member tidak boleh kosong" },
        },
      },

      email: {
        type: DataTypes.STRING(191),
        allowNull: true,
        unique: true,
        validate: {
          isEmail: { msg: "Format email tidak valid" },
        },
      },

      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      role: {
        type: DataTypes.ENUM('EXP Lane', 'Gold Lane', 'Mid Lane', 'Jungler', 'Roam'),
        allowNull: false,
        defaultValue: 'Gold Lane',
        comment: "Posisi/role player dalam game (EXP/Gold/Mid/Jungler/Roam)",
      },
    },
    {
      tableName: "members",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Member;
};
