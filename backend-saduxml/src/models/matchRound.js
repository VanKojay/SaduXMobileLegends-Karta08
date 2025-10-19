import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const MatchRound = sequelize.define(
    'MatchRound',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      match_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stage_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      round_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score_team1: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      score_team2: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      winner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'ongoing', 'finished'),
        defaultValue: 'pending',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'match_rounds',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return MatchRound;
};
