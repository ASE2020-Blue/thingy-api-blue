'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('thingy', [
      {
        name: 'blue-1',
      }, {
        name: 'blue-2',
      }, {
        name: 'blue-3',
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('thingy', null, {});
  }
};
