'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('match_rounds', [
      // ⚔️ Match 1 (Event 1, Group Stage)
      {
        event_id: 1,
        match_id: 1,
        stage_id: 1,
        round_number: 1,
        score_team1: 1,
        score_team2: 0,
        winner_id: 1,
        status: 'finished',
        note: 'Team 1 menang lewat early game dominan',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 1,
        match_id: 1,
        stage_id: 1,
        round_number: 2,
        score_team1: 0,
        score_team2: 1,
        winner_id: 2,
        status: 'finished',
        note: 'Team 2 comeback late game',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 1,
        match_id: 1,
        stage_id: 1,
        round_number: 3,
        score_team1: 1,
        score_team2: 0,
        winner_id: 1,
        status: 'finished',
        note: 'Team 1 menang 2-1',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('match_rounds', null, {});
  },
};