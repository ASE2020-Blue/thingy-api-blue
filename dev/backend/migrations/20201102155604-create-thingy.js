'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('thingy', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING,
        unique: true
      },
      createdAt: {
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('thingy');
  }
};