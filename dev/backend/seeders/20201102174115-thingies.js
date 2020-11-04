'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('thingy', [
      {
        uuid: 'rainbow-22',
      },
      {
        uuid: 'red-22',
      },
      {
        uuid: 'unicorn-22',
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('thingy', null, {});
  }
};
