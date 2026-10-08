module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    reviewable_type: { type: DataTypes.ENUM('doctor', 'hospital', 'pharmacy') },
    reviewable_id: { type: DataTypes.INTEGER },
    rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT },
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'reviews' });
  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return Review;
};