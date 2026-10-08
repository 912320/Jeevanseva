module.exports = (sequelize, DataTypes) => {
  const DoctorTimeSlot = sequelize.define('DoctorTimeSlot', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    doctor_id: { type: DataTypes.INTEGER },
    availability_id: { type: DataTypes.INTEGER },
    slot_date: { type: DataTypes.DATEONLY },
    start_time: { type: DataTypes.TIME },
    end_time: { type: DataTypes.TIME },
    max_bookings: { type: DataTypes.INTEGER, defaultValue: 1 },
    current_bookings: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('available', 'full', 'blocked'), defaultValue: 'available' }
  }, { tableName: 'doctor_time_slots' });
  DoctorTimeSlot.associate = (models) => {
    DoctorTimeSlot.belongsTo(models.DoctorAvailability, { foreignKey: 'availability_id' });
  };
  return DoctorTimeSlot;
};