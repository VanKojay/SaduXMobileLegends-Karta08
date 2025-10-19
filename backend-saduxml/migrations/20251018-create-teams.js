'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teams', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(191), allowNull: false },
      email: { type: Sequelize.STRING(191), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      verify_token: { type: Sequelize.STRING(255), allowNull: true },
      verify_expires: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('teams');
  },
};
