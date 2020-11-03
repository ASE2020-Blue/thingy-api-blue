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
    envParam: DataTypes.ENUM("TEMPERATURE", "HUMIDITY", "AIR_QUALITY", "AIR_PRESSURE", "CO2_EQUIV", "LIGHT")
  }, {
    sequelize,
    modelName: 'environmentParamsValue',
    freezeTableName: true,
  });
  return environmentParamsValue;
};