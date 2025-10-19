'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert('groups', [
    { name: 'Group A', created_at: new Date(), updated_at: new Date() },
    { name: 'Group B', created_at: new Date(), updated_at: new Date() },
    { name: 'Group C', created_at: new Date(), updated_at: new Date() },
    { name: 'Group D', created_at: new Date(), updated_at: new Date() },
  ], {});
}

/** @type {import('sequelize-cli').Migration} */
export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('groups', null, {});
}