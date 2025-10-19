import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Stage = sequelize.define(
    'Stage',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Nama babak: Penyisihan, Semifinal, Final, dll',
      },
      type: {
        type: DataTypes.ENUM('group_stage', 'knockout', 'final'),
        allowNull: false,
        defaultValue: 'knockout',
      },
      order_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('upcoming', 'ongoing', 'finished'),
        defaultValue: 'upcoming',
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
      tableName: 'stages',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Stage.associate = (models) => {
    // 1 stage bisa punya banyak match
    Stage.hasMany(models.Match, {
      foreignKey: 'stage_id',
      as: 'matches',
    });

    // 1 stage bisa punya banyak ronde (opsional)
    Stage.hasMany(models.MatchRound, {
      foreignKey: 'stage_id',
      as: 'rounds',
    });
  };

  return Stage;
};
