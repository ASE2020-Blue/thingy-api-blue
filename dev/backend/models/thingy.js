'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class thingy extends Model {
    static associate(models) {
      this.hasMany(models.locationHistory, {
        foreignKey: 'thingyId',
        onDelete: 'CASCADE'
      });
      this.hasMany(models.environmentParamsValue, {
        foreignKey: 'thingyId',
        onDelete: 'CASCADE'
      });
    }
  };
  thingy.init({
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'thingy',
  });
  return thingy;
};