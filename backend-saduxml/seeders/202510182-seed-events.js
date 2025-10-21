'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('events', [
      {
        title: 'Mobile Legends Championship Season 1',
        description: 'Turnamen Mobile Legends perdana dengan format grup dan eliminasi.',
        date: new Date('2025-11-01T12:00:00Z'),
        max_teams: 16,
        min_teams: 4,
        registration_deadline: new Date('2025-10-30T23:59:00Z'),
        status: 'open',
        created_by: 1, // ID user pembuat event (sesuaikan dengan user di tabel users)
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Dwi Keren Cup 2025',
        description: 'Kompetisi khusus komunitas Dwi Keren, full bracket BO3.',
        date: new Date('2025-12-05T15:00:00Z'),
        max_teams: 32,
        min_teams: 8,
        registration_deadline: new Date('2025-12-01T23:59:00Z'),
        status: 'draft',
        created_by: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Alpha eSports Invitational',
        description: 'Undangan eksklusif untuk tim profesional terbaik dari Asia Tenggara.',
        date: new Date('2026-01-20T18:00:00Z'),
        max_teams: 8,
        min_teams: 4,
        registration_deadline: new Date('2026-01-10T23:59:00Z'),
        status: 'closed',
        created_by: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'SaduX ML Open Tournament',
        description: 'Turnamen terbuka dengan sistem Swiss, hadiah total 10 juta!',
        date: new Date('2025-11-15T10:00:00Z'),
        max_teams: 64,
        min_teams: 8,
        registration_deadline: new Date('2025-11-10T23:59:00Z'),
        status: 'ongoing',
        created_by: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('events', null, {});
  },
};
