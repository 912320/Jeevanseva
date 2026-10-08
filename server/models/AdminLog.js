module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AdminLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    admin_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
    action: { type: DataTypes.STRING },
    entity_type: { type: DataTypes.STRING },
    entity_id: { type: DataTypes.INTEGER },
    old_values: { type: DataTypes.JSON },
    new_values: { type: DataTypes.JSON }
  }, { tableName: 'admin_logs' });
};