const sequelize = require('../utils/database');
const Sequelize = require('sequelize');

const Group = sequelize.define('groups', {
    id:{
        type : Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        allowNull:false
    },
    group_name:{
        type : Sequelize.STRING,
        allowNull: false,
        unique: 'group name must be unique',

    }
})

module.exports = Group;