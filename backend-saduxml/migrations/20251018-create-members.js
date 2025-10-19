'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('members', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      team_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'members', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      ml_id: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(191), allowNull: false },
      email: { type: Sequelize.STRING(191), allowNull: true, unique: true },
      phone: { type: Sequelize.STRING(50), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('members');
  },
};
