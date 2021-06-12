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
////////////////ROTAS GET////////////////
app.get('/', function(req, res){
    return res.send('Api rest com express');
});

app.get('/usuarios', eAdmin, async function(req, res){
    await Usuario.findAll({order: [['id', 'DESC']]}).then(function(usuarios){
        return res.json({
            erro: false,
            usuarios
        });
    }).catch(function(){
        return res.json({
            erro: true,
            message: "Erro: Nenhum usuário encontrado!"
        });
    });
});

app.get('/usuario/:id', eAdmin, async (req, res) => {
    
    await Usuario.findByPk(req.params.id).then(function(usuario){
        return res.json({
            error: false,
            usuario
        });
    }).then(function(){
        return res.json({
            error: true,
            message: "Nenhum usuário encontrado"
        });
    })
});
////////////////FIM ROTAS GET////////////////

////////////////ROTAS POST////////////////
app.post('/login', async (req, res) => {
    
    const usuario = await Usuario.findOne({where: {email: req.body.usuario}});
    if(usuario === null){
        return res.json({
            erro: false,
            message: "Erro: Usuário ou a senha incorreta!"
        });
    }

    if(!(await bcrypt.compare(req.body.senha, usuario.senha))){
        return res.json({
            erro: false,
            message: "Erro: Usuário ou a senha incorreta!"
        });
    }
    var token = jwt.sign({id: usuario.id}, process.env.SECRET,{
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
////////////////FIM ROTAS POST////////////////

////////////////ROTAS PUT////////////////
app.put('/usuario', async (req, res) => {
    var dados = req.body;
    dados.senha = await bcrypt.hash(dados.senha, 8);
    await Usuario.update(dados, {where: {id: dados.id}}).
    then(function(){
        return res.json({
            "erro": false,
            "message":"Usuário editado com sucesso!"
        });
    }).catch(function(){
        return res.json({
            "erro": true,
            "message":"Não foi possível editar o usuário"
        });
    });
})
////////////////FIM ROTAS PUT////////////////

////////////////ROTAS DELETE////////////////
app.delete('/usuario/:id', eAdmin, async function(req, res){
    await Usuario.destroy({where: {id: req.params.id}}).
    then(function(){
        return res.json({
            erro: false,
            message: "Usuário excluído com sucesso!"
        })
    }).
    catch(function(){
        return res.json({
            erro: true,
            message: "Não foi possível excluir o usuário!"
        })
    })
})
////////////////FIM ROTAS DELETE////////////////

app.listen(8080, function(){
    console.log('Servidor iniciado na porta 8080, http://localhost:8080');
});