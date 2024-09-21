// models/offense.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Offense モデルの定義
const Offense = sequelize.define('Offense', {
  character1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  character2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  character3: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Offense;
