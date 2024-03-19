const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express()
const handlebars = require('express-handlebars').engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// Visualização de arquivos estáticos
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, 'views', 'components')
}));
// Configurar o middleware para servir arquivos estáticos
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
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

// Rota para listar clientes
app.get('/listar', (req, res) => {
    connection.query('SELECT * FROM clientes', (err, rows) => {
        if (err) {
            console.error('Erro ao listar clientes:', err);
            res.status(500).send('Erro ao listar clientes');
            return;
        }
        res.render('listar', { clientes: rows });
    });
});

// Rota para renderizar a página de edição de cliente
app.post('/atualizar/:id', (req, res) => {
    const clienteId = req.params.id;
    const { nome, cep, endereco, bairro, cidade, estado, observacoes } = req.body;

    const sql = "UPDATE clientes SET nome = ?, cep = ?, endereco = ?, bairro = ?, cidade = ?, estado = ?, observacoes = ? WHERE id = ?";
    const values = [nome, cep, endereco, bairro, cidade, estado, observacoes, clienteId];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar cliente:', err);
            res.status(500).send('Erro ao atualizar cliente');
            return;
        }

        console.log('Cliente atualizado com sucesso!');
        res.redirect('/listar');
    });
});

// Rota para excluir cliente
app.get('/excluir/:id', (req, res) => {
    const clienteId = req.params.id;
    connection.query('DELETE FROM clientes WHERE id = ?', clienteId, (err, result) => {
        if (err) {
            console.error('Erro ao excluir cliente:', err);
            res.status(500).send('Erro ao excluir cliente');
            return;
        }
        console.log('Cliente excluído com sucesso!');
        res.redirect('/listar');
    });
});

app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000')
});