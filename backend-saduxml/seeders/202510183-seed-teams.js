'use strict';

import bcrypt from 'bcryptjs';

export default {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);

    await queryInterface.bulkInsert('teams', [
      {
        event_id: 1,
        name: 'Alpha Warriors',
        email: 'alpha.warriors@example.com',
        password: await bcrypt.hash('password123', salt),
        verified: true,
        verify_token: null,
        verify_expires: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 1,
        name: 'Omega Legends',
        email: 'omega.legends@example.com',
        password: await bcrypt.hash('password123', salt),
        verified: true,
        verify_token: null,
        verify_expires: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 2,
        name: 'Dwi Keren Squad',
        email: 'dwi.keren@example.com',
        password: await bcrypt.hash('dwibosganteng', salt),
        verified: false,
        verify_token: 'abc123token',
        verify_expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 hari
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 3,
        name: 'Phoenix Reborn',
        email: 'phoenix.reborn@example.com',
        password: await bcrypt.hash('reborn2025', salt),
        verified: true,
        verify_token: null,
        verify_expires: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 4,
        name: 'SaduX Esports',
        email: 'sadux.esports@example.com',
        password: await bcrypt.hash('saduxmlrocks', salt),
        verified: true,
        verify_token: null,
        verify_expires: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('teams', null, {});
  },
};
