module.exports = (sequelize, DataTypes) => {
  return sequelize.define('EmergencyService', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    coverage_area: { type: DataTypes.STRING },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'emergency_services' });
};