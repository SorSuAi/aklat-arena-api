'use strict';

// Fictitious accounts only. School IDs start with 2099 and emails use the
// reserved ".test" domain, so nothing here can match a real person.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      { school_id: '2099-0001', full_name: 'Maria Ong', email: 'maria.ong@aklatarena.test', role: 'HOST' },
      { school_id: '2099-0002', full_name: 'Library Admin', email: 'admin@aklatarena.test', role: 'ADMIN' },
      { school_id: '2099-1001', full_name: 'Rina Dela Cruz', email: 'rina@aklatarena.test', role: 'PLAYER' },
      { school_id: '2099-1002', full_name: 'Dale Santos', email: 'dale@aklatarena.test', role: 'PLAYER' },
      { school_id: '2099-1003', full_name: 'Paolo Reyes', email: 'paolo@aklatarena.test', role: 'PLAYER' },
      { school_id: '2099-1004', full_name: 'Bea Lim', email: 'bea@aklatarena.test', role: 'PLAYER' },
      { school_id: '2099-1005', full_name: 'Lia Gomez', email: 'lia@aklatarena.test', role: 'PLAYER' },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
