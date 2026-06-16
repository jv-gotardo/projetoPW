const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Usuario = sequelize.define('Usuario', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    }
}, {
    tableName: 'usuarios',
    underscored: true,
    timestamps: true
});

module.exports = Usuario;