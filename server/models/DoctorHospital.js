module.exports = (sequelize, DataTypes) => {
  const DoctorHospital = sequelize.define('DoctorHospital', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    doctor_id: { type: DataTypes.INTEGER },
    hospital_id: { type: DataTypes.INTEGER },
    is_primary: { type: DataTypes.BOOLEAN },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { 
    tableName: 'doctor_hospitals',
    indexes: [{ unique: true, fields: ['doctor_id', 'hospital_id'] }]
  });
  return DoctorHospital;
};