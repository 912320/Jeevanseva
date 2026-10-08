module.exports = (sequelize, DataTypes) => {
  return sequelize.define('DiseaseMedicine', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    disease_id: { type: DataTypes.INTEGER },
    medicine_id: { type: DataTypes.INTEGER },
    usage_notes: { type: DataTypes.TEXT },
    safety_warning: { type: DataTypes.TEXT }
  }, { tableName: 'disease_medicines' });
};