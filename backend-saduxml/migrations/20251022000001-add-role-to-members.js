'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('members', 'role', {
      type: Sequelize.ENUM('EXP Lane', 'Gold Lane', 'Mid Lane', 'Jungler', 'Roam'),
      allowNull: false,
      defaultValue: 'Gold Lane',
      after: 'phone',
      comment: 'Posisi/role player dalam game (EXP/Gold/Mid/Jungler/Roam)',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('members', 'role');
  },
};
