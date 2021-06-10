const jwt = require('jsonwebtoken');
const {promisify} = require('util');// ferramenta de callback node.
require('dotenv').config();

module.exports = {
    eAdmin: async function (req, res, next){
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
}