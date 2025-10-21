'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('groups', [
      // === Event 1: Mobile Legends Championship Season 1 ===
      {
        name: 'Group A',
        event_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Group B',
        event_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // === Event 2: Dwi Keren Cup 2025 ===
      {
        name: 'Group Dwi Power',
        event_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Group Bos Besar',
        event_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // === Event 3: Alpha eSports Invitational ===
      {
        name: 'Group Elite',
        event_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // === Event 4: SaduX ML Open Tournament ===
      {
        name: 'Group Legend',
        event_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Group Mythic',
        event_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Group Glory',
        event_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('groups', null, {});
  },
};
