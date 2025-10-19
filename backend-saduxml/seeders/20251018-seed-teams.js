import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const passwordHash = bcrypt.hashSync('teamseedpass', 10);
  return queryInterface.bulkInsert('teams', [
    {
      name: 'SeedTeam',
      email: 'seedteam@example.com',
      password: passwordHash,
      verified: true,
      verify_token: null,
      verify_expires: null,
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});
}


/** @type {import('sequelize-cli').Migration} */
export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('teams', { email: 'seedteam@example.com' }, {});
}
