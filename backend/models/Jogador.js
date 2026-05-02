const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const Categoria = require('./Categoria');

const Jogador = sequelize.define('Jogador', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idade: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'jogadores'
});

// Relacionamento: Categoria tem muitos jogadores
Categoria.hasMany(Jogador, { foreignKey: 'categoria_id' });
Jogador.belongsTo(Categoria, { foreignKey: 'categoria_id' });

module.exports = Jogador;