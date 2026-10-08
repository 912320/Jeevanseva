module.exports = (sequelize, DataTypes) => {
  const Medicine = sequelize.define('Medicine', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true },
    generic_name: { type: DataTypes.STRING },
    name_hindi: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    uses: { type: DataTypes.TEXT },
    side_effects: { type: DataTypes.TEXT },
    precautions: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING },
    prescription_required: { type: DataTypes.BOOLEAN, defaultValue: true },
    manufacturer: { type: DataTypes.STRING },
    drug_class: { type: DataTypes.STRING }
  }, { tableName: 'medicines' });
  Medicine.associate = (models) => {
    Medicine.belongsToMany(models.Disease, { through: models.DiseaseMedicine, foreignKey: 'medicine_id' });
  };
  return Medicine;
};