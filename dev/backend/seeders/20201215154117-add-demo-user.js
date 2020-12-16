'use strict';

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync();
    const hashPassword = bcrypt.hashSync('mC0mpl*xPass', salt);

     await queryInterface.bulkInsert('users', [{
       firstname: 'John',
       lastname: 'Doe',
       email: 'demo@unifr.ch',
       password: hashPassword,
       createdAt: new Date(),
       updatedAt: new Date(),
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { email: 'demo@unifr.ch' }, {});
  }
};
