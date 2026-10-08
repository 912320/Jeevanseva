module.exports = (sequelize, DataTypes) => {
  const Symptom = sequelize.define('Symptom', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true },
    name_hindi: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    body_part: { type: DataTypes.STRING },
    severity: { type: DataTypes.STRING }
  }, { tableName: 'symptoms' });
  Symptom.associate = (models) => {
    Symptom.belongsToMany(models.Disease, { through: models.DiseaseSymptom, foreignKey: 'symptom_id' });
  };
  return Symptom;
};