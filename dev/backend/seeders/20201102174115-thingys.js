'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('thingy', [
      {
        name: 'blue-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        name: 'blue-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        name: 'blue-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('thingy', null, {});
  }
};
