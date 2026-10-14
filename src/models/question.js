module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Question',
    {
      question_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      set_id: { type: DataTypes.INTEGER, allowNull: false },
      prompt: { type: DataTypes.TEXT, allowNull: false },
      time_limit_ms: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 20000 },
      base_points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1000 },
      position: { type: DataTypes.SMALLINT, allowNull: false },
    },
    { tableName: 'questions', timestamps: false }
  );
