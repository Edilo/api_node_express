const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const cors = require('cors');
const { eAdmin } = require('./middlewares/auth');
const Usuario = require('./models/Usuario');


app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER,Content-Type, Authorization");
    app.use(cors());
    next();
});

app.get('/', function(req, res){
    return res.send('Api rest com express');
});

app.get('/usuarios', eAdmin, function(req, res){
    return res.json({
        erro: false,
        message: "Listar usuários"
    });
});

app.post('/login', async (req, res) => {
    
    const usuario = await Usuario.findOne({where: {email: req.body.usuario}});
    if(usuario === null){
        return res.json({
            erro: false,
            message: "Usuário não encontrado!"
        });
    }

    if(!(await bcrypt.compare(req.body.senha, usuario.senha))){
        return res.json({
            erro: false,
            message: "Erro: senha inválida!"
        });
    }
        var privateKey = process.env.SECRET;
        var token = jwt.sign({id: usuario.id}, privateKey,{
            // expiresIn: 600 //10minutos
            expiresIn: '7d'
        })
        return res.json({
            erro: false,
            message: "Login efetuado com sucesso!",
            dados: req.body,
            token
        });
});

app.post('/usuario', async (req, res) => {
    var dados = req.body;
    // return res.json({dados: req.body});
    dados.senha = await bcrypt.hash(dados.senha, 8);

    await Usuario.create(req.body).then(function(){
        return res.json({
            erro: false,
            message: "Usuário cadastrado com sucesso!",
        });
    }).catch(function(){
        return res.json({
            erro: false,
            message: "Não foi possível cadastrar o usuário!"
        });
    });
})



app.listen(8080, function(){
    console.log('Servidor iniciado na porta 8080, http://localhost:8080');
});