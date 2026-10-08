module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    title: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT },
    type: { type: DataTypes.ENUM('appointment', 'system', 'alert', 'reminder') },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    data: { type: DataTypes.JSON }
  }, { tableName: 'notifications' });
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return Notification;
};