'use strict';
const { ThingyLocalization } = require('../proto/thingy_pb');

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

    getGRpcLocation() {
      let thingyLocalization = new ThingyLocalization();
      thingyLocalization.setThingyUuid(this.uuid);
      let location = this.locationHistory && this.locationHistory[1].locationName || undefined;
      thingyLocalization.setLocation(location);
      return thingyLocalization;
    }
  }

  thingy.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER},
    uuid: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'thingy',
    freezeTableName: true,
  });
  return thingy;
};
