'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('hospitals', 'data_source', {
      type: Sequelize.ENUM('manual', 'google_places', 'rapidapi_places'),
      allowNull: false,
      defaultValue: 'manual'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('hospitals', 'data_source', {
      type: Sequelize.ENUM('manual', 'google_places'),
      allowNull: false,
      defaultValue: 'manual'
    });
  }
};
