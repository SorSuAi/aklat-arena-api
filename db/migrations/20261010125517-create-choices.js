'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('choices', {
      choice_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'question_id' },
        onDelete: 'CASCADE',
      },
      label: { type: Sequelize.STRING(200), allowNull: false },
      is_correct: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('choices');
  },
};
