'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // Ambil salah satu tim
  const teams = await queryInterface.sequelize.query(
    `SELECT id FROM teams LIMIT 1;`
  );
  const teamId = teams[0][0]?.id || 1;

  // Ambil salah satu grup (escape karena "groups" keyword SQL)
  const groups = await queryInterface.sequelize.query(
    `SELECT id FROM \`groups\` LIMIT 1;`
  );
  const groupId = groups[0][0]?.id || 1;

  // Insert dummy match
  await queryInterface.bulkInsert('matches', [
    {
      group_id: groupId,
      team1_id: teamId,
      team2_id: teamId, // sementara dummy
      match_date: new Date(),
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

/** @type {import('sequelize-cli').Migration} */
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('matches', null, {});
}
