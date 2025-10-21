'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('group_teams', [
      // === Event 1: Mobile Legends Championship Season 1 ===
      { event_id: 1, group_id: 1, team_id: 1, created_at: new Date(), updated_at: new Date() },
      { event_id: 1, group_id: 1, team_id: 2, created_at: new Date(), updated_at: new Date() },
      { event_id: 1, group_id: 2, team_id: 3, created_at: new Date(), updated_at: new Date() },
      { event_id: 1, group_id: 2, team_id: 4, created_at: new Date(), updated_at: new Date() },

      // === Event 2: Dwi Keren Cup 2025 ===
      { event_id: 2, group_id: 3, team_id: 1, created_at: new Date(), updated_at: new Date() },
      { event_id: 2, group_id: 3, team_id: 2, created_at: new Date(), updated_at: new Date() },
      { event_id: 2, group_id: 4, team_id: 3, created_at: new Date(), updated_at: new Date() },
      { event_id: 2, group_id: 4, team_id: 4, created_at: new Date(), updated_at: new Date() },

      // === Event 3: Alpha eSports Invitational ===
      { event_id: 3, group_id: 5, team_id: 1, created_at: new Date(), updated_at: new Date() },
      { event_id: 3, group_id: 5, team_id: 2, created_at: new Date(), updated_at: new Date() },

      // === Event 4: SaduX ML Open Tournament ===
      { event_id: 4, group_id: 6, team_id: 1, created_at: new Date(), updated_at: new Date() },
      { event_id: 4, group_id: 6, team_id: 2, created_at: new Date(), updated_at: new Date() },
      { event_id: 4, group_id: 7, team_id: 3, created_at: new Date(), updated_at: new Date() },
      { event_id: 4, group_id: 8, team_id: 4, created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('group_teams', null, {});
  },
};
