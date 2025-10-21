'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('members', [
      {
        event_id: 1,
        team_id: 1,
        ml_id: 'ML123456',
        name: 'Rexxy',
        role: 'Roam',
        email: 'rexxy@example.com',
        phone: '081234567890',
        role: 'Gold Lane',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 1,
        team_id: 1,
        ml_id: 'ML789012',
        name: 'Dwi The Big Bos',
        role: 'Roam',
        email: 'dwi@example.com',
        phone: '089876543210',
        role: 'Roam',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 1,
        team_id: 2,
        ml_id: 'ML345678',
        name: 'Andra',
        role: 'Roam',
        email: 'andra@example.com',
        phone: '081298765432',
        role: 'Jungler',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 2,
        team_id: 3,
        ml_id: 'ML987654',
        name: 'Zaiba',
        role: 'Roam',
        email: 'zaiba@example.com',
        phone: '085212345678',
        role: 'Mid Lane',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('members', null, {});
  },
};