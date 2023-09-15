const sequelize = require('../utils/database');
const Sequelize = require('sequelize');

const Users = sequelize.define('users',{

    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        allowNull:false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensure email addresses are unique
      },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Default value for isAdmin is false
      },
});

module.exports = Users;