const sequelize = require('../utils/database');
const Sequelize = require('sequelize');

const Users = require('./users');
const Groups= require('./groups');

const GroupMembers = sequelize.define('groupMembers', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: 'id',
      },
    },
    groupId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Groups,
        key: 'id',
      },
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  module.exports = GroupMembers;