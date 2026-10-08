module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    favorable_type: { type: DataTypes.ENUM('doctor', 'hospital', 'pharmacy') },
    favorable_id: { type: DataTypes.INTEGER }
  }, { 
    tableName: 'favorites',
    indexes: [{ unique: true, fields: ['user_id', 'favorable_type', 'favorable_id'] }]
  });
  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return Favorite;
};