const express = require('express');
const app = express();
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');
//Conectando a base de dados
connection
    .authenticate()
    .then(() => console.log('Conexão feita com o banco de dados!'))
    .catch((msgmErro) => console.log(msgmErro))

//Informando ao express qual o motor da view
app.set('view engine', 'ejs');
//Informando ao express para utilizar arquivos estaticos na pasta public
app.use(express.static('public'));

//traduzindo dados do front para o express
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Rotas
app.get('/', (req, res) => {
    //Mostrando todos os dados da tabela do banco e exibindo no front
    Pergunta.findAll({ raw: true, order: [
        ['id', 'DESC'] //ASC => crescente || DESC => decrescente
    ] }).then(perguntas => {
        res.render('index', {
            perguntas
        });
    });
});

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
})


app.post('/salvarpergunta', (req, res) => {
    //Recuperando dados do form
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;
    //Inserindo dados no BD
    Pergunta.create({
        titulo,
        descricao
        //Redirecionando usuario para pagina inicial
    }).then(() => {
        res.redirect('/');
    });
});


app.get('/pergunta/:id', (req, res) => {
    let id = req.params.id;
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if(pergunta != undefined) {
            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta,
                    respostas
                });
            });
        } else {
            res.redirect('/');
        };
    });
});

app.post('/responder', (req, res) => {
    let corpo = req.body.corpo;
    let perguntaId = req.body.pergunta;
    Resposta.create({
        corpo,
        perguntaId
    }).then(() => {
        res.redirect(`/pergunta/${perguntaId}`);
    });
})

//Subindo servidor
app.listen(3000, () => console.log('Servidor ON'));