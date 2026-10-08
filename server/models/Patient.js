module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, unique: true, references: { model: 'users', key: 'id' } },
    date_of_birth: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.ENUM('male', 'female', 'other') },
    blood_group: { type: DataTypes.STRING(5) },
    medical_history: { type: DataTypes.TEXT },
    emergency_contact: { type: DataTypes.STRING(15) }
  }, { tableName: 'patients' });
  Patient.associate = (models) => {
    Patient.belongsTo(models.User, { foreignKey: 'user_id' });
    Patient.hasMany(models.Appointment, { foreignKey: 'patient_id' });
  };
  return Patient;
};