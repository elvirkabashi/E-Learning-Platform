
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserDetails = sequelize.define('UserDetails', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  contact: DataTypes.STRING,
  preferences: DataTypes.STRING
});

module.exports = UserDetails;
