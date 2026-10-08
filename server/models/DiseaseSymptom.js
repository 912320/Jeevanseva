module.exports = (sequelize, DataTypes) => {
  return sequelize.define('DiseaseSymptom', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    disease_id: { type: DataTypes.INTEGER },
    symptom_id: { type: DataTypes.INTEGER },
    relevance: { type: DataTypes.ENUM('high', 'medium', 'low'), defaultValue: 'medium' }
  }, { tableName: 'disease_symptoms' });
};