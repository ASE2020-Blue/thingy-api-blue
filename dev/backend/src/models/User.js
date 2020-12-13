'use strict';

const bcrypt = require("bcrypt");
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}

    static hashPassword (password) {
      const salt = bcrypt.genSaltSync();
      return bcrypt.hashSync(password, salt);
    }

    comparePassword (otherPassword) {
      return bcrypt.compareSync(otherPassword, this.password);
    }
  }

  User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user'
  });
  return User;
};
