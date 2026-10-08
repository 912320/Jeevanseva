module.exports = (sequelize, DataTypes) => {
  const DoctorAvailability = sequelize.define('DoctorAvailability', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    doctor_id: { type: DataTypes.INTEGER },
    day_of_week: { type: DataTypes.ENUM('monday','tuesday','wednesday','thursday','friday','saturday','sunday') },
    start_time: { type: DataTypes.TIME },
    end_time: { type: DataTypes.TIME },
    break_start: { type: DataTypes.TIME },
    break_end: { type: DataTypes.TIME },
    slot_duration_minutes: { type: DataTypes.INTEGER, defaultValue: 15 },
    max_patients_per_slot: { type: DataTypes.INTEGER, defaultValue: 1 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'doctor_availabilities' });
  DoctorAvailability.associate = (models) => {
    DoctorAvailability.belongsTo(models.Doctor, { foreignKey: 'doctor_id' });
    DoctorAvailability.hasMany(models.DoctorTimeSlot, { foreignKey: 'availability_id' });
  };
  return DoctorAvailability;
};