// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'aklat-arena',          // our group's game
  name: 'AklatArena',
  team: 'Kadlagan Devs (3-1)',
  developer: 'SorSuAi',      // my GitHub username: this build is mine
  description: 'Answer fast and correctly to top the arena leaderboard.',
  min_players: 2,
  max_players: 60,
  version: pkg.version,         // read from package.json, do not edit here
};
