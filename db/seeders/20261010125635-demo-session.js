'use strict';

// One game in progress: 3 players, 2 questions already answered.
// Bea (2099-1004) has an account but has not joined - accounts are not players.

const TIME_LIMIT_MS = 20000;

// Scoring rule R8: 1000 base + up to 500 for speed. Wrong or timed out = 0.
function points(isCorrect, elapsedMs) {
  if (!isCorrect) return 0;
  return 1000 + Math.floor((500 * (TIME_LIMIT_MS - elapsedMs)) / TIME_LIMIT_MS);
}

// choice: the label of the choice picked, or null when time ran out
const PLAYS = [
  { schoolId: '2099-1001', nickname: 'Rina', answers: [
    { question: 1, choice: '600', elapsedMs: 4200 },
    { question: 2, choice: 'International Standard Book Number', elapsedMs: 6100 },
  ] },
  { schoolId: '2099-1002', nickname: 'Dale', answers: [
    { question: 1, choice: '600', elapsedMs: 9800 },
    { question: 2, choice: 'Indexed Serial Book Notation', elapsedMs: 7400 },
  ] },
  { schoolId: '2099-1003', nickname: 'Pao', answers: [
    { question: 1, choice: '600', elapsedMs: 12050 },
    { question: 2, choice: null, elapsedMs: 20000 },
  ] },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    const [[host]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0001'");
    const [[set]] = await db.query(
      "SELECT set_id FROM question_sets WHERE title = 'Library Orientation Basics'"
    );

    await queryInterface.bulkInsert('game_sessions', [
      {
        set_id: set.set_id,
        host_id: host.user_id,
        join_pin: '731594',
        status: 'RUNNING',
        max_players: 60,
        current_position: 2,
        started_at: new Date(),
      },
    ]);
    const [[session]] = await db.query(
      "SELECT session_id FROM game_sessions WHERE join_pin = '731594'"
    );

    const [choices] = await db.query(
      `SELECT c.choice_id, c.label, c.is_correct,
              q.question_id, q.position AS question_position
         FROM choices c JOIN questions q ON q.question_id = c.question_id
        WHERE q.set_id = :setId`,
      { replacements: { setId: set.set_id } }
    );

    for (const play of PLAYS) {
      const [[user]] = await db.query('SELECT user_id FROM users WHERE school_id = :schoolId', {
        replacements: { schoolId: play.schoolId },
      });

      const answerRows = play.answers.map((answer) => {
        const picked = choices.find(
          (c) => c.question_position === answer.question && c.label === answer.choice
        );
        const question = choices.find((c) => c.question_position === answer.question);
        const isCorrect = Boolean(picked && picked.is_correct);
        return {
          question_id: question.question_id,
          choice_id: picked ? picked.choice_id : null,
          elapsed_ms: answer.elapsedMs,
          is_correct: isCorrect,
          points_awarded: points(isCorrect, answer.elapsedMs),
        };
      });

      // score is stored, so it must equal the sum of this player's points
      const score = answerRows.reduce((total, row) => total + row.points_awarded, 0);

      await queryInterface.bulkInsert('players', [
        {
          session_id: session.session_id,
          user_id: user.user_id,
          nickname: play.nickname,
          score,
          last_seen_at: new Date(),
        },
      ]);
      const [[player]] = await db.query(
        'SELECT player_id FROM players WHERE session_id = :sessionId AND user_id = :userId',
        { replacements: { sessionId: session.session_id, userId: user.user_id } }
      );

      await queryInterface.bulkInsert(
        'answers',
        answerRows.map((row) => ({ ...row, player_id: player.player_id }))
      );
    }
  },

  async down(queryInterface) {
    // players and answers go with their session (ON DELETE CASCADE)
    await queryInterface.bulkDelete('game_sessions', { join_pin: '731594' }, {});
  },
};
