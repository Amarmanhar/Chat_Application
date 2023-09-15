const sequelize = require('../utils/database');
const Sequelize = require('sequelize');

const Message = sequelize.define('chatMessages',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        allowNull:false
    },
    message:{
        type: Sequelize.TEXT,
        allowNull: false,
    }

})

module.exports = Message;