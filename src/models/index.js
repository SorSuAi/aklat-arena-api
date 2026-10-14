// ONE Sequelize instance (one connection pool) for the whole API.
// Every other file imports it from here - nobody opens a second one.
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Load each model explicitly - easy to read, easy to debug.
const User = require('./user')(sequelize, DataTypes);
const QuestionSet = require('./question-set')(sequelize, DataTypes);
const Question = require('./question')(sequelize, DataTypes);
const Choice = require('./choice')(sequelize, DataTypes);
const GameSession = require('./game-session')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);
const Answer = require('./answer')(sequelize, DataTypes);

// Associations = the relationship lines of the ERD, read in both directions.
User.hasMany(QuestionSet, { foreignKey: 'host_id' });
QuestionSet.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

QuestionSet.hasMany(Question, { foreignKey: 'set_id' });
Question.belongsTo(QuestionSet, { foreignKey: 'set_id' });

Question.hasMany(Choice, { foreignKey: 'question_id' });
Choice.belongsTo(Question, { foreignKey: 'question_id' });

QuestionSet.hasMany(GameSession, { foreignKey: 'set_id' });
GameSession.belongsTo(QuestionSet, { foreignKey: 'set_id' });
GameSession.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

GameSession.hasMany(Player, { foreignKey: 'session_id' });
Player.belongsTo(GameSession, { foreignKey: 'session_id' });
Player.belongsTo(User, { foreignKey: 'user_id' });

Player.hasMany(Answer, { foreignKey: 'player_id' });
Answer.belongsTo(Player, { foreignKey: 'player_id' });
Answer.belongsTo(Question, { foreignKey: 'question_id' });
Answer.belongsTo(Choice, { foreignKey: 'choice_id' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  QuestionSet,
  Question,
  Choice,
  GameSession,
  Player,
  Answer,
};
