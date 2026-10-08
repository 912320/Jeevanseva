module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define('Doctor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, unique: true },
    registration_number: { type: DataTypes.STRING, unique: true },
    qualification: { type: DataTypes.STRING },
    experience_years: { type: DataTypes.INTEGER },
    bio: { type: DataTypes.TEXT },
    consultation_fee: { type: DataTypes.DECIMAL(10, 2) },
    languages_spoken: { type: DataTypes.STRING },
    is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, { tableName: 'doctors' });
  Doctor.associate = (models) => {
    Doctor.belongsTo(models.User, { foreignKey: 'user_id' });
    Doctor.hasMany(models.DoctorSpecialization, { foreignKey: 'doctor_id' });
    Doctor.belongsToMany(models.Hospital, { through: models.DoctorHospital, foreignKey: 'doctor_id' });
    Doctor.hasMany(models.DoctorAvailability, { foreignKey: 'doctor_id' });
    Doctor.hasMany(models.Appointment, { foreignKey: 'doctor_id' });
  };
  return Doctor;
};