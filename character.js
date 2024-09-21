const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const Character = sequelize.define('Character', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    image_url: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Character;
