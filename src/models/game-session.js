module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'GameSession',
    {
      session_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      set_id: { type: DataTypes.INTEGER, allowNull: false },
      host_id: { type: DataTypes.INTEGER, allowNull: false },
      join_pin: { type: DataTypes.CHAR(6), allowNull: false, unique: true },
      status: { type: DataTypes.STRING(12), allowNull: false, defaultValue: 'LOBBY' },
      max_players: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 60 },
      current_position: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
      started_at: { type: DataTypes.DATE },
      ended_at: { type: DataTypes.DATE },
    },
    { tableName: 'game_sessions', timestamps: false }
  );
