module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Answer',
    {
      answer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      player_id: { type: DataTypes.INTEGER, allowNull: false },
      question_id: { type: DataTypes.INTEGER, allowNull: false },
      choice_id: { type: DataTypes.INTEGER, allowNull: true },
      elapsed_ms: { type: DataTypes.INTEGER, allowNull: false },
      is_correct: { type: DataTypes.BOOLEAN, allowNull: false },
      points_awarded: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { tableName: 'answers', timestamps: true, createdAt: 'answered_at', updatedAt: false }
  );
