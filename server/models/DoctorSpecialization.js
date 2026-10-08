module.exports = (sequelize, DataTypes) => {
  const DoctorSpecialization = sequelize.define('DoctorSpecialization', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    doctor_id: { type: DataTypes.INTEGER },
    specialization: { type: DataTypes.STRING },
    is_primary: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'doctor_specializations' });
  DoctorSpecialization.associate = (models) => {
    DoctorSpecialization.belongsTo(models.Doctor, { foreignKey: 'doctor_id' });
  };
  return DoctorSpecialization;
};