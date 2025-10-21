import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Stage = sequelize.define(
    "Stage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Relasi ke event tempat stage ini berada",
        validate: {
          notEmpty: { msg: "Event ID tidak boleh kosong" },
        },
      },

      best_of: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Nama babak: Penyisihan, Semifinal, Final, dll",
      },

      type: {
        type: DataTypes.ENUM("group_stage", "knockout", "final"),
        allowNull: false,
        defaultValue: "knockout",
      },

      order_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Urutan stage dalam event",
      },

      status: {
        type: DataTypes.ENUM("upcoming", "ongoing", "finished"),
        defaultValue: "upcoming",
      },
    },
    {
      tableName: "stages",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Stage;
};