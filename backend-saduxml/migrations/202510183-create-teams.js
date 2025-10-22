'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teams', {
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
        comment: 'Relasi ke event yang diikuti tim ini',
      },

      name: {
        type: Sequelize.STRING(191),
        allowNull: false,
      },

      leader_name: {
        type: Sequelize.STRING(191),
        allowNull: true,
      },

      leader_phone: {
        type: Sequelize.STRING(191),
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Password yang sudah di-hash',
      },

      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      verify_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      verify_expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },

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
    await queryInterface.dropTable('teams');
  },
};
