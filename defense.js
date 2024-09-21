const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

// Defense モデルの定義
const Defense = sequelize.define('Defense', {
    character1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    character2: {
        type: Sequelize.STRING,
        allowNull: false
    },
    character3: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});



module.exports = Defense;
