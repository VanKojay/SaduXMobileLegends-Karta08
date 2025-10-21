'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('stages', [
      {
        event_id: 1,
        name: 'Group Stage',
        type: 'group_stage',
        order_number: 1,
        status: 'upcoming',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 1,
        name: 'Semifinal',
        type: 'knockout',
        order_number: 2,
        status: 'upcoming',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 1,
        name: 'Final',
        type: 'final',
        order_number: 3,
        status: 'upcoming',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 2,
        name: 'Group Stage',
        type: 'group_stage',
        order_number: 1,
        status: 'ongoing',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 2,
        name: 'Grand Final',
        type: 'final',
        order_number: 2,
        status: 'upcoming',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('stages', null, {});
  },
};