'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('match_rounds', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // 🔗 Relasi utama
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'events', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Relasi ke event tempat ronde ini berada',
      },
      match_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'matches', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Relasi ke match induk',
      },
      stage_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'stages', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      // ⚙️ Data ronde
      round_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Nomor ronde (1, 2, 3, dst)',
      },

      // ⚔️ Skor & hasil
      score_team1: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      score_team2: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
        allowNull: false,
        defaultValue: 'pending',
      },

      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      // 🕒 Timestamps
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // 🔒 Unique constraint agar 1 match tidak bisa punya ronde dengan nomor sama
    await queryInterface.addConstraint('match_rounds', {
      fields: ['match_id', 'round_number'],
      type: 'unique',
      name: 'unique_match_round_number',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('match_rounds');
  },
};
