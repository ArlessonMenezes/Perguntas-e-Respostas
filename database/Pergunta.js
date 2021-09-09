const Sequelize  = require('sequelize');
const connection = require('./database');

//Criando tabela com Sequelize
const Pergunta = connection.define('perguntas', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Sincronizar tabela com o banco e criar a mesma somente uma vez
Pergunta.sync({ force: false }).then(() => {});

module.exports = Pergunta;