'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: Sequelize.STRING(191),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Password sudah di-hash menggunakan bcrypt',
      },

      role: {
        type: Sequelize.ENUM('super_admin', 'admin'),
        allowNull: false,
        defaultValue: 'admin',
        comment: 'super_admin = pengelola aplikasi, admin = pengelola event',
      },

      // 🔹 Hanya digunakan jika role = admin
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: {
        //   model: 'events',
        //   key: 'id',
        // },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Relasi ke event (hanya untuk admin event)',
      },

      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      verify_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    // 🧹 Hapus ENUM sebelum dropTable untuk mencegah error di PostgreSQL / MySQL
    await queryInterface.dropTable('users');
  },
};