const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nome'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'senha'
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    }
}, {
    tableName: 'usuarios',
    underscored: true
});

module.exports = User;