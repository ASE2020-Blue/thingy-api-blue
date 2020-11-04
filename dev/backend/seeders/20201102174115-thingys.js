'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('thingy', [
      {
        uuid: 'blue-1',
      }, {
        uuid: 'blue-2',
      }, {
        uuid: 'blue-3',
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('thingy', null, {});
  }
};
