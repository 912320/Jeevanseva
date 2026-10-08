module.exports = (sequelize, DataTypes) => {
  const Disease = sequelize.define('Disease', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true },
    name_hindi: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    description_hindi: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING },
    severity: { type: DataTypes.STRING },
    specialty: { type: DataTypes.STRING },
    precautions: { type: DataTypes.TEXT },
    when_to_see_doctor: { type: DataTypes.TEXT },
    is_emergency: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'diseases' });
  Disease.associate = (models) => {
    Disease.belongsToMany(models.Symptom, { through: models.DiseaseSymptom, foreignKey: 'disease_id' });
    Disease.belongsToMany(models.Medicine, { through: models.DiseaseMedicine, foreignKey: 'disease_id' });
  };
  return Disease;
};