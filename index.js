// models/index.js

const sequelize = require('../config/db');
const Character = require('./character');
const Defense = require('./defense');
const Offense = require('./offense');
const Battle = require('./battle');

// モデル間の関連付け
Defense.hasMany(Battle);
Offense.hasMany(Battle);
Battle.belongsTo(Defense);
Battle.belongsTo(Offense);

module.exports = {
  sequelize,
  Character,
  Defense,
  Offense,
  Battle,
};
