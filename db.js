const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gvg_tracker', 'root', '3833', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;
