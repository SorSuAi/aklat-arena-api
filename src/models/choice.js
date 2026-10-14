module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Choice',
    {
      choice_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      question_id: { type: DataTypes.INTEGER, allowNull: false },
      label: { type: DataTypes.STRING(200), allowNull: false },
      is_correct: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { tableName: 'choices', timestamps: false }
  );
