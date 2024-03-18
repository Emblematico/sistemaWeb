const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express()
const handlebars = require('express-handlebars').engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sistema_web_node'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados!');
});

app.get('/', function (req, res) {
    res.render('home')
})

app.post('/cadastrar-cliente', (req, res) => {
    const { nome, cep, endereco, bairro, cidade, estado, observacoes, createdAt, updatedAt } = req.body;

    const sql = "INSERT INTO clientes (nome, cep, endereco, bairro, cidade, estado, observacoes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [nome, cep, endereco, bairro, cidade, estado, observacoes, createdAt, updatedAt];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            res.status(500).send('Erro ao cadastrar cliente');
            return;
        }

        console.log('Cliente cadastrado com sucesso!');
        res.status(200).send('Cliente cadastrado com sucesso');
    });
});

app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000')
});