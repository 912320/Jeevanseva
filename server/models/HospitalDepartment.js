module.exports = (sequelize, DataTypes) => {
  const HospitalDepartment = sequelize.define('HospitalDepartment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hospital_id: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    head_doctor: { type: DataTypes.STRING },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'hospital_departments' });
  HospitalDepartment.associate = (models) => {
    HospitalDepartment.belongsTo(models.Hospital, { foreignKey: 'hospital_id' });
  };
  return HospitalDepartment;
};