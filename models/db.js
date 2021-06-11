const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node', 'root', 'my@teste', {
    host: '147.1.0.83',
    dialect: 'mysql',
    timezone: '-04:00'
  });

//   sequelize.authenticate().then(function(){
//     console.log("CONEXÃO COM O BANCO DE DADOS COM SUCESSO!");
//   }).catch(function(err){
//     console.log("NÃO FOI POSSÍVEL REALIZAR A CONEXÃO COM O BANCO DE DADOS");
//   })

  module.exports = sequelize;