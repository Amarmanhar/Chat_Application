const Sequelize = require('sequelize');
const sequelize =   new Sequelize('groupchat','root', 'Amar@123', {
    host:'localhost',
    dialect: 'mysql' ,
});

module.exports = sequelize;