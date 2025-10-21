'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('events', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      vanue: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      // 🔹 Pengaturan jumlah tim
      max_teams: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 16,
        comment: 'Jumlah maksimal tim yang bisa ikut',
      },

      min_teams: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
        comment: 'Jumlah minimal tim untuk event bisa dimulai',
      },

      registration_deadline: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Batas waktu pendaftaran tim',
      },

      // 🔹 Status turnamen
      status: {
        type: Sequelize.ENUM('draft', 'open', 'closed', 'ongoing', 'finished'),
        allowNull: false,
        defaultValue: 'draft',
      },

      // 🔹 Relasi ke User
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'User pembuat event (admin atau super_admin)',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    // hapus enum dulu biar migration bisa rollback lancar di PostgreSQL/MySQL
    await queryInterface.dropTable('events');
  },
};
