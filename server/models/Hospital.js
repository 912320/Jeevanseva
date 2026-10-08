module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define('Hospital', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, unique: true },
    name: { type: DataTypes.STRING },
    registration_number: { type: DataTypes.STRING, unique: true },
    type: { type: DataTypes.ENUM('government', 'private', 'clinic', 'phc', 'chc') },
    description: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING },
    has_emergency: { type: DataTypes.BOOLEAN },
    emergency_contact: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    opening_hours: { type: DataTypes.STRING },
    latitude: { type: DataTypes.FLOAT },
    longitude: { type: DataTypes.FLOAT },
    address: { type: DataTypes.TEXT },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    pincode: { type: DataTypes.STRING },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
    google_place_id: { type: DataTypes.STRING, unique: true, allowNull: true },
    data_source: { type: DataTypes.ENUM('manual', 'google_places', 'rapidapi_places'), defaultValue: 'manual', allowNull: false },
    last_synced_at: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'hospitals' });
  Hospital.associate = (models) => {
    Hospital.belongsTo(models.User, { foreignKey: 'user_id' });
    Hospital.belongsToMany(models.Doctor, { through: models.DoctorHospital, foreignKey: 'hospital_id' });
    Hospital.hasMany(models.HospitalDepartment, { foreignKey: 'hospital_id' });
  };
  return Hospital;
};
