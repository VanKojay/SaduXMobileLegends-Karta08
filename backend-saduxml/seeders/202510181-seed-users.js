'use strict';

import bcrypt from 'bcryptjs';

export default {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Super Admin SaduX',
        email: 'superadmin@example.com',
        password: await bcrypt.hash('supersecure', salt),
        role: 'super_admin',
        event_id: 1,
        verified: true,
        verify_token: null,
        created_at: new Date(),
      },
      {
        name: 'Admin Alpha',
        email: 'admin.alpha@example.com',
        password: await bcrypt.hash('alphaadmin', salt),
        role: 'admin',
        event_id: 2, // Mengelola event Mobile Legends Championship Season 1
        verified: true,
        verify_token: null,
        created_at: new Date(),
      },
      {
        name: 'Admin Dwi Cup',
        email: 'admin.dwicup@example.com',
        password: await bcrypt.hash('dwicup2025', salt),
        role: 'admin',
        event_id: 3, // Mengelola event Dwi Keren Cup 2025
        verified: true,
        verify_token: null,
        created_at: new Date(),
      },
      {
        name: 'Admin Alpha Invitational',
        email: 'admin.alpha.invite@example.com',
        password: await bcrypt.hash('alphainvite', salt),
        role: 'admin',
        event_id: 3,
        verified: false, // Belum verifikasi
        verify_token: 'token12345',
        created_at: new Date(),
      },
      {
        name: 'Admin SaduX ML',
        email: 'admin.sadux@example.com',
        password: await bcrypt.hash('saduxrocks', salt),
        role: 'admin',
        event_id: 4,
        verified: true,
        verify_token: null,
        created_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};