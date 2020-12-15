'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LocationHistory extends Model {
        static associate(models) {
            this.belongsTo(models.thingy)
        }
    }

    LocationHistory.init({
        thingyId: DataTypes.INTEGER,
        locationName: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'locationHistory'
    });
    return LocationHistory;
};
