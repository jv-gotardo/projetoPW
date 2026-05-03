const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const Jogador = require('./Jogador');

const Partida = sequelize.define('Partida', {
    data: {
        type: DataTypes.DATE,
        field: 'data'
    },
    local: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'partidas',
    underscored: true,
    timestamps: true
});

// Relacionamentos:
Partida.belongsTo(Jogador, { as: 'vencedor', foreignKey: 'vencedor_id' });
Partida.belongsTo(Jogador, { as: 'perdedor', foreignKey: 'perdedor_id' });

module.exports = Partida;