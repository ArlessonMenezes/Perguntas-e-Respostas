const sequelize = require('sequelize');

const connection = new sequelize('guiaperguntas', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = connection;