const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const Jogador = require('./Jogador');

const Partida = sequelize.define('Partida', {
    data: {
        type: DataTypes.DATE
    },
    local: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'partidas'
});

// Relacionamentos:
Partida.belongsTo(Jogador, { as: 'vencedor', foreignKey: 'vencedor_id' });
Partida.belongsTo(Jogador, { as: 'perdedor', foreignKey: 'perdedor_id' });

module.exports = Partida;