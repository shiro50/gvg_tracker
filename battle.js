// models/battle.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Defense = require('./defense');
const Offense = require('./offense');

const Battle = sequelize.define('Battle', {
  result: {
    type: DataTypes.ENUM('win', 'lose'),
    allowNull: false,
  },
  battleDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

// モデル間の関連付け
Battle.belongsTo(Defense);
Battle.belongsTo(Offense);

module.exports = Battle;
