'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EnvironmentParamsValue extends Model {
    static associate(models) {
      this.belongsTo(models.thingy)
    }
  }

  EnvironmentParamsValue.init({
    thingyId: DataTypes.INTEGER,
    value: DataTypes.FLOAT,
    envParam: DataTypes.ENUM("TEMPERATURE", "HUMIDITY", "AIR_QUALITY", "AIR_PRESSURE", "CO2_EQUIV", "LIGHT")
  }, {
    sequelize,
    modelName: 'environmentParamsValue'
  });
  return EnvironmentParamsValue;
};
