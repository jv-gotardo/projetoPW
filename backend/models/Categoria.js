const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Categoria = sequelize.define('Categoria', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nivel: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'categorias',
    underscored: true,
    timestamps: true
});

module.exports = Categoria;