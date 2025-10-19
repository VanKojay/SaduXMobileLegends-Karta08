'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('match_rounds', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      match_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'matches', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      stage_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'stages', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      round_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Ronde ke berapa (1, 2, 3, dst)',
      },
      score_team1: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      score_team2: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      winner_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'teams', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: Sequelize.ENUM('pending', 'ongoing', 'finished'),
        defaultValue: 'pending',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('match_rounds');
  },
};
