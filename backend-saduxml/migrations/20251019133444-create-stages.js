'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nama babak, misalnya: Penyisihan, Perempat Final, Semifinal, Final',
      },
      type: {
        type: Sequelize.ENUM('group_stage', 'knockout', 'final'),
        allowNull: false,
        defaultValue: 'knockout',
        comment: 'Tipe babak turnamen',
      },
      order_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Urutan babak di turnamen (1 = penyisihan, 2 = semifinal, dst)',
      },
      status: {
        type: Sequelize.ENUM('upcoming', 'ongoing', 'finished'),
        defaultValue: 'upcoming',
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
    await queryInterface.dropTable('stages');
  },
};
