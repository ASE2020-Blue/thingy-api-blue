'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class environmentParamsValue extends Model {
    static associate(models) {
      this.belongsTo(models.thingy)
    }
  };
  environmentParamsValue.init({
    thingyId: DataTypes.INTEGER,
    value: DataTypes.INTEGER,
    envParam: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'environmentParamsValue',
  });
  return environmentParamsValue;
};