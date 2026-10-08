'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('hospitals', 'google_place_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    await queryInterface.addColumn('hospitals', 'data_source', {
      type: Sequelize.ENUM('manual', 'google_places'),
      allowNull: false,
      defaultValue: 'manual'
    });
    await queryInterface.addColumn('hospitals', 'last_synced_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('hospitals', 'last_synced_at');
    await queryInterface.removeColumn('hospitals', 'data_source');
    await queryInterface.removeColumn('hospitals', 'google_place_id');
  }
};
