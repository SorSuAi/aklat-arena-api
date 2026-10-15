'use strict';

// A game that has ENDED (status CLOSED), so the results endpoint has something
// to report (Hub Contract v1.2, rule 7).
// AklatArena's rule for "completed": the player answered every question of the
// set. A timed-out answer still counts as answered.
// Awkward cases on purpose:
//   - Dale and Pao tie for second place, so they share rank 2 and Rina is alone at 1.
//   - Lia left after two questions: she is listed, but not completed and not ranked.

const TIME_LIMIT_MS = 20000;
function points(isCorrect, elapsedMs) {
  if (!isCorrect) return 0;
  return 1000 + Math.floor((500 * (TIME_LIMIT_MS - elapsedMs)) / TIME_LIMIT_MS);
}

// choice: the label picked, or null when time ran out
const PLAYS = [
  { schoolId: '2099-1001', nickname: 'Rina', answers: [
    { question: 1, choice: '600', elapsedMs: 3900 },
    { question: 2, choice: 'International Standard Book Number', elapsedMs: 5200 },
    { question: 3, choice: 'Index', elapsedMs: 6100 },
    { question: 4, choice: '13', elapsedMs: 4800 },
    { question: 5, choice: 'Locating a book on the shelf', elapsedMs: 7000 },
  ] },
  { schoolId: '2099-1002', nickname: 'Dale', answers: [
    { question: 1, choice: '600', elapsedMs: 8000 },
    { question: 2, choice: 'International Standard Book Number', elapsedMs: 8000 },
    { question: 3, choice: 'Glossary', elapsedMs: 9000 },
    { question: 4, choice: '13', elapsedMs: 8000 },
    { question: 5, choice: null, elapsedMs: 20000 },
  ] },
  { schoolId: '2099-1003', nickname: 'Pao', answers: [
    { question: 1, choice: '600', elapsedMs: 8000 },
    { question: 2, choice: 'International Standard Book Number', elapsedMs: 8000 },
    { question: 3, choice: 'Preface', elapsedMs: 11000 },
    { question: 4, choice: '13', elapsedMs: 8000 },
    { question: 5, choice: 'Renewing a borrowed book', elapsedMs: 12000 },
  ] },
  { schoolId: '2099-1005', nickname: 'Lia', answers: [
    { question: 1, choice: '500', elapsedMs: 15000 },
    { question: 2, choice: 'International Standard Book Number', elapsedMs: 9000 },
  ] },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;
    const [[host]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0001'");
    const [[set]] = await db.query("SELECT set_id FROM question_sets WHERE title = 'Library Orientation Basics'");

    await queryInterface.bulkInsert('game_sessions', [{
      set_id: set.set_id,
      host_id: host.user_id,
      join_pin: '418263',
      status: 'CLOSED',
      max_players: 60,
      current_position: 5,
      started_at: new Date('2026-10-09T01:00:00Z'),
      ended_at: new Date('2026-10-09T01:12:00Z'),
    }]);
    const [[session]] = await db.query("SELECT session_id FROM game_sessions WHERE join_pin = '418263'");

    const [choices] = await db.query(
      `SELECT c.choice_id, c.label, c.is_correct, q.question_id, q.position AS question_position
         FROM choices c JOIN questions q ON q.question_id = c.question_id
        WHERE q.set_id = :setId`,
      { replacements: { setId: set.set_id } }
    );

    for (const play of PLAYS) {
      const [[user]] = await db.query('SELECT user_id FROM users WHERE school_id = :schoolId', {
        replacements: { schoolId: play.schoolId },
      });
      const answerRows = play.answers.map((answer) => {
        const picked = choices.find((c) => c.question_position === answer.question && c.label === answer.choice);
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
      const score = answerRows.reduce((total, row) => total + row.points_awarded, 0);

      await queryInterface.bulkInsert('players', [{
        session_id: session.session_id,
        user_id: user.user_id,
        nickname: play.nickname,
        score,
        last_seen_at: new Date('2026-10-09T01:12:00Z'),
      }]);
      const [[player]] = await db.query(
        'SELECT player_id FROM players WHERE session_id = :sessionId AND user_id = :userId',
        { replacements: { sessionId: session.session_id, userId: user.user_id } }
      );
      await queryInterface.bulkInsert('answers', answerRows.map((row) => ({ ...row, player_id: player.player_id })));
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('game_sessions', { join_pin: '418263' }, {});
  },
};
