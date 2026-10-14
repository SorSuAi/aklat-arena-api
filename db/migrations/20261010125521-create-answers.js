'use strict';

// answers - junction table resolving players <-> questions.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      answer_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'players', key: 'player_id' },
        onDelete: 'CASCADE',
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'question_id' },
        onDelete: 'RESTRICT',
      },
      // nullable on purpose: a player who runs out of time has no choice
      choice_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'choices', key: 'choice_id' },
        onDelete: 'RESTRICT',
      },
      elapsed_ms: { type: Sequelize.INTEGER, allowNull: false },
      is_correct: { type: Sequelize.BOOLEAN, allowNull: false },
      points_awarded: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      answered_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    // this is what turns a duplicate submission into a 409 Conflict
    await queryInterface.addConstraint('answers', {
      type: 'unique',
      name: 'uq_one_answer',
      fields: ['player_id', 'question_id'],
    });
    await queryInterface.addConstraint('answers', {
      type: 'check',
      name: 'ck_answers_elapsed',
      fields: ['elapsed_ms'],
      where: { elapsed_ms: { [Sequelize.Op.gte]: 0 } },
    });
    await queryInterface.addConstraint('answers', {
      type: 'check',
      name: 'ck_answers_points',
      fields: ['points_awarded'],
      where: { points_awarded: { [Sequelize.Op.gte]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('answers');
  },
};
