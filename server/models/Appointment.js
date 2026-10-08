module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patient_id: { type: DataTypes.INTEGER },
    doctor_id: { type: DataTypes.INTEGER },
    hospital_id: { type: DataTypes.INTEGER, allowNull: true },
    time_slot_id: { type: DataTypes.INTEGER },
    appointment_date: { type: DataTypes.DATEONLY },
    appointment_time: { type: DataTypes.TIME },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show'), defaultValue: 'pending' },
    reason: { type: DataTypes.TEXT },
    notes: { type: DataTypes.TEXT },
    fee: { type: DataTypes.DECIMAL(10, 2) },
    payment_status: { type: DataTypes.ENUM('pending', 'paid', 'refunded'), defaultValue: 'pending' }
  }, { tableName: 'appointments' });
  Appointment.associate = (models) => {
    Appointment.belongsTo(models.Patient, { foreignKey: 'patient_id' });
    Appointment.belongsTo(models.Doctor, { foreignKey: 'doctor_id' });
    Appointment.belongsTo(models.Hospital, { foreignKey: 'hospital_id' });
    Appointment.belongsTo(models.DoctorTimeSlot, { foreignKey: 'time_slot_id' });
  };
  return Appointment;
};