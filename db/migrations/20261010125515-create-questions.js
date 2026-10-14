'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'question_sets', key: 'set_id' },
        onDelete: 'CASCADE',
      },
      prompt: { type: Sequelize.TEXT, allowNull: false },
      time_limit_ms: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 20000 },
      base_points: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1000 },
      position: { type: Sequelize.SMALLINT, allowNull: false },
    });

    await queryInterface.addConstraint('questions', {
      type: 'unique',
      name: 'uq_question_position',
      fields: ['set_id', 'position'],
    });
    await queryInterface.addConstraint('questions', {
      type: 'check',
      name: 'ck_questions_time_limit',
      fields: ['time_limit_ms'],
      where: { time_limit_ms: { [Sequelize.Op.between]: [5000, 120000] } },
    });
    await queryInterface.addConstraint('questions', {
      type: 'check',
      name: 'ck_questions_base_points',
      fields: ['base_points'],
      where: { base_points: { [Sequelize.Op.gt]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  },
};
