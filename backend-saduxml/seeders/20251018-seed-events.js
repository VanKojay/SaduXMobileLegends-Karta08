/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert('events', [
    {
      title: 'Tournament Alpha',
      description: 'Test tournament alpha.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      created_at: new Date()
    },
    {
      title: 'Tournament Beta',
      description: 'Weekly casual event.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      created_at: new Date()
    }
  ], {});
}

/** @type {import('sequelize-cli').Migration} */
export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('events', {
    title: ['Tournament Alpha', 'Tournament Beta']
  }, {});
};
