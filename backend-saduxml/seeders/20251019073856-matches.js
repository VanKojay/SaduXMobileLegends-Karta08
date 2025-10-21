'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('matches', [
      // ⚔️ Event 1 - Group Stage
      {
        event_id: 1,
        stage_id: 1, // Group Stage
        group_id: 1,
        team1_id: 1,
        team2_id: 2,
        round: 'Group A - Match 1',
        match_date: new Date('2025-11-01T14:00:00Z'),
        score_team1: null,
        score_team2: null,
        winner_id: null,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 1,
        stage_id: 1,
        group_id: 1,
        team1_id: 3,
        team2_id: 4,
        round: 'Group A - Match 2',
        match_date: new Date('2025-11-01T15:00:00Z'),
        score_team1: null,
        score_team2: null,
        winner_id: null,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('matches', null, {});
  },
};