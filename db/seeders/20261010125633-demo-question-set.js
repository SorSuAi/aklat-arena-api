'use strict';

// One question set with 5 questions and 4 choices each.
// IDs are never typed by hand: we insert the parent, then look its ID up.

const QUESTIONS = [
  {
    prompt: 'In the Dewey Decimal Classification, which main class covers Technology?',
    choices: ['300', '500', '600', '800'],
    correct: 2,
  },
  {
    prompt: 'What does ISBN stand for?',
    choices: [
      'International Standard Book Number',
      'Indexed Serial Book Notation',
      'International Shelf Barcode Number',
      'Integrated System for Book Naming',
    ],
    correct: 0,
  },
  {
    prompt: 'Which part of a book lists topics alphabetically with their page numbers?',
    choices: ['Preface', 'Glossary', 'Table of contents', 'Index'],
    correct: 3,
  },
  {
    prompt: 'How many digits does an ISBN assigned today have?',
    choices: ['8', '13', '10', '16'],
    correct: 1,
  },
  {
    prompt: 'What is a call number mainly used for?',
    choices: [
      'Renewing a borrowed book',
      'Locating a book on the shelf',
      'Paying an overdue fine',
      'Reserving a reading room',
    ],
    correct: 1,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    const [[host]] = await db.query(
      "SELECT user_id FROM users WHERE school_id = '2099-0001'"
    );

    await queryInterface.bulkInsert('question_sets', [
      {
        host_id: host.user_id,
        title: 'Library Orientation Basics',
        subject: 'Library Skills',
        is_public: true,
      },
    ]);
    const [[set]] = await db.query(
      "SELECT set_id FROM question_sets WHERE title = 'Library Orientation Basics'"
    );

    await queryInterface.bulkInsert(
      'questions',
      QUESTIONS.map((q, index) => ({
        set_id: set.set_id,
        prompt: q.prompt,
        time_limit_ms: 20000,
        base_points: 1000,
        position: index + 1,
      }))
    );
    const [questions] = await db.query(
      'SELECT question_id, position FROM questions WHERE set_id = :setId ORDER BY position',
      { replacements: { setId: set.set_id } }
    );

    const choiceRows = [];
    questions.forEach((row) => {
      const source = QUESTIONS[row.position - 1];
      source.choices.forEach((label, index) => {
        choiceRows.push({
          question_id: row.question_id,
          label,
          is_correct: index === source.correct,
        });
      });
    });
    await queryInterface.bulkInsert('choices', choiceRows);
  },

  async down(queryInterface) {
    // choices and questions go with their set (ON DELETE CASCADE)
    await queryInterface.bulkDelete('question_sets', { title: 'Library Orientation Basics' }, {});
  },
};
