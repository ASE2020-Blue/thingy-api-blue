'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('environmentParamsValues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      thingyId: {
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'thingy',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      value: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      envParam: {
        allowNull: false,
        type: Sequelize.ENUM("TEMPERATURE", "HUMIDITY", "AIR_QUALITY", "AIR_PRESSURE", "CO2_EQUIV", "LIGHT")
      },
      createdAt: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('environmentParamsValues');
  }
};