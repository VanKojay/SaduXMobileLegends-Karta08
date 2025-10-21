import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM("super_admin", "admin"),
        allowNull: false,
        defaultValue: "admin",
        comment: "super_admin = pengelola aplikasi, admin = pengelola event",
      },

      event_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Hanya digunakan jika role = admin (mengelola satu event)",
      },

      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      verify_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,

      defaultScope: {
        attributes: { exclude: ["password"] },
      },

      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },

      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  return User;
};
