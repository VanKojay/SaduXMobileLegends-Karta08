'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('members', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // 🔹 Relasi ke event
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'events',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Relasi ke event tempat member ini bertanding',
      },

      // 🔹 Relasi ke team
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Relasi ke team tempat member ini tergabung',
      },

      // 🔹 Data pemain
      ml_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'ID Mobile Legends player',
      },

      name: {
        type: Sequelize.STRING(191),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(191),
        allowNull: true,
        unique: true,
      },

      phone: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      // 🔹 Timestamp
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('members');
  },
};