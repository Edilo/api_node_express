const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');
const { eAdmin } = require('./middlewares/auth');

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

app.post('/login', function(req, res){
    if(req.body.usuario === 'edilo13@gmail.com' && req.body.senha === '123456'){
        const { id } = 1;
        var privateKey = process.env.SECRET;
        var token = jwt.sign({id}, privateKey,{
            // expiresIn: 600 //10minutos
            expiresIn: '7d'
        })
        return res.json({
            erro: false,
            message: "Login efetuado com sucesso!",
            dados: req.body,
            token
        });
    }
    return res.json({
        erro: false,
        message: "Login inválido",
        dados: req.body
    });
    
});



app.listen(8080, function(){
    console.log('Servidor iniciado na porta 8080, http://localhost:8080');
});