import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const passwordHash = bcrypt.hashSync('password123', 10);
  return queryInterface.bulkInsert('users', [
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: passwordHash,
      verified: true,
      verify_token: null,
      created_at: new Date()
    },
    {
      name: 'User One',
      email: 'user1@example.com',
      password: bcrypt.hashSync('user1pass', 10),
      verified: true,
      verify_token: null,
      created_at: new Date()
    }
  ], {});
}

/** @type {import('sequelize-cli').Migration} */
export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('users', {
    email: ['admin@example.com', 'user1@example.com']
  }, {});
}
