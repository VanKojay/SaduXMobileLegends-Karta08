'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // Ambil ID Group A
  const groups = await queryInterface.sequelize.query(
    `SELECT id FROM \`groups\` WHERE name = 'Group A';`
  );
  const groupId = groups[0][0]?.id || 1;

  // Ambil ID Team SeedTeam
  const teams = await queryInterface.sequelize.query(
    `SELECT id FROM \`teams\` WHERE email = 'seedteam@example.com';`
  );
  const teamId = teams[0][0]?.id || 1;

  // Masukkan relasi ke tabel group_teams
  await queryInterface.bulkInsert('group_teams', [
    {
      group_id: groupId,
      team_id: teamId,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

/** @type {import('sequelize-cli').Migration} */
export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('group_teams', null, {});
}