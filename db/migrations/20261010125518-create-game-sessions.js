'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      session_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'question_sets', key: 'set_id' },
        onDelete: 'RESTRICT',
      },
      host_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'RESTRICT',
      },
      join_pin: { type: Sequelize.CHAR(6), allowNull: false, unique: true },
      status: { type: Sequelize.STRING(12), allowNull: false, defaultValue: 'LOBBY' },
      max_players: { type: Sequelize.SMALLINT, allowNull: false, defaultValue: 60 },
      current_position: { type: Sequelize.SMALLINT, allowNull: false, defaultValue: 0 },
      started_at: { type: Sequelize.DATE, allowNull: true },
      ended_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.addConstraint('game_sessions', {
      type: 'check',
      name: 'ck_sessions_status',
      fields: ['status'],
      where: { status: ['LOBBY', 'RUNNING', 'CLOSED'] },
    });
    await queryInterface.addConstraint('game_sessions', {
      type: 'check',
      name: 'ck_sessions_max_players',
      fields: ['max_players'],
      where: { max_players: { [Sequelize.Op.gt]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('game_sessions');
  },
};
