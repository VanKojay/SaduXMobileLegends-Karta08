import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

export default (sequelize) => {
  const Team = sequelize.define("Team", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(191), allowNull: false },
    email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verify_token: { type: DataTypes.STRING(255), allowNull: true },
    verify_expires: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: "teams",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    // 🔒 Default scope: password tidak akan muncul otomatis
    defaultScope: {
      attributes: { exclude: ["password"] },
    },

    // Kalau butuh ambil password (misal untuk login)
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },

    // 🔥 Hooks untuk hash password sebelum disimpan
    hooks: {
      beforeCreate: async (team) => {
        if (team.password) {
          const salt = await bcrypt.genSalt(10);
          team.password = await bcrypt.hash(team.password, salt);
        }
      },
      beforeUpdate: async (team) => {
        if (team.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          team.password = await bcrypt.hash(team.password, salt);
        }
      }
    }
  });

  return Team;
};
