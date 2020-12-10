'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class locationHistory extends Model {
    static associate(models) {
      this.belongsTo(models.thingy)
    }
  }

  locationHistory.init({
    thingyId: DataTypes.INTEGER,
    locationName: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'locationHistory',
    freezeTableName: true,
  });
  return locationHistory;
};
