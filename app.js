const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');
const {promisify} = require('util');// ferramenta de callback node.

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

app.get('/usuarios', validarToken, function(req, res){
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

async function validarToken(req, res, next){
    // return res.json({message: "Validar o token!"});
    const authHeader = req.headers.authorization;
    
    if(!authHeader){
        return res.json({
            erro: true,
            message: "Erro: Necessário realizar o login para acessar a página!"
        });
    }
    

    try{
        const [, token] = authHeader.split(' ');
        const decode = await promisify(jwt.verify)(token, process.env.SECRET);
        req.userId = decode.id;
        return next();
    }catch(err){
        return res.json({
            erro: true,
            message: "Erro: Login ou senha inválido!"
        });
    }
    
        // const [, token] = authHeader.split(' ');
        // return res.json({token});
    
    //const [, token] = authHeader.split(' ');
    //return res.json({token});
    // if(!token){
    //     return res.json({
    //         erro: true,
    //         message: "Erro: Token inválido!"
    //     });
    // }
}

app.listen(8080, function(){
    console.log('Servidor iniciado na porta 8080, http://localhost:8080');
});