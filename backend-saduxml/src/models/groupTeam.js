import { DataTypes } from "sequelize";

export default (sequelize) => {
  const GroupTeam = sequelize.define(
    "GroupTeam",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Relasi ke event tempat tim ini ikut di grup",
        validate: {
          notEmpty: { msg: "Event ID tidak boleh kosong" },
        },
      },

      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Group ID tidak boleh kosong" },
        },
      },

      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Team ID tidak boleh kosong" },
        },
      },
    },
    {
      tableName: "group_teams",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["group_id", "team_id"],
          name: "unique_group_team_pair",
        },
      ],
    }
  );

  return GroupTeam;
};
