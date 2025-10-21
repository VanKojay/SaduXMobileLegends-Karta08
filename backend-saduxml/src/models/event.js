import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Event = sequelize.define("Event", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title tidak boleh kosong" },
        len: { args: [3, 255], msg: "Title minimal 3 karakter" },
      },
    },

    vanue: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Format tanggal tidak valid" },
      },
    },

    // 🔹 Pengaturan jumlah tim
    max_teams: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 16, // default 16 tim
      validate: {
        min: { args: [2], msg: "Minimal 2 tim" },
      },
    },
    min_teams: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      validate: {
        min: { args: [2], msg: "Minimal 2 tim" },
        isLessThanMax(value) {
          if (value > this.max_teams) {
            throw new Error("Minimal tim tidak boleh lebih besar dari maksimal tim");
          }
        },
      },
    },

    registration_deadline: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: "Format tanggal pendaftaran tidak valid" },
      },
    },

    // 🔹 Status turnamen
    status: {
      type: DataTypes.ENUM("draft", "open", "closed", "ongoing", "finished"),
      allowNull: false,
      defaultValue: "draft",
    },

    // 🔹 Relasi ke User (pembuat event)
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: "events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return Event;
};
