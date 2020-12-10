'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('thingy', [
      {
        uuid: 'rainbow-22',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'red-22',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'unicorn-22',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('thingy', null, {});
  }
};
