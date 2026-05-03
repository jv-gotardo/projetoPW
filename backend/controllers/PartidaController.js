const Partida = require('../models/Partida');
const Jogador = require('../models/Jogador');

module.exports = {
    async criar(req, res) {
        try {
            const { vencedor_id, perdedor_id, local, data } = req.body; 

            if (vencedor_id === perdedor_id) {
                return res.status(400).json({ erro: "O vencedor e o perdedor não podem ser a mesma pessoa." });
            }

            const novaPartida = await Partida.create({ 
                vencedor_id, 
                perdedor_id, 
                local, 
                data 
            });
            
            return res.status(201).json(novaPartida);
        } catch (error) {
            console.error(error); 
            return res.status(500).json({ erro: "Erro ao registrar partida" });
        }
    },

    async listar(req, res) {
        try {
            const partidas = await Partida.findAll({
                include: [
                    { model: Jogador, as: 'vencedor', attributes: ['nome'] },
                    { model: Jogador, as: 'perdedor', attributes: ['nome'] }
                ]
            });
            return res.json(partidas);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao listar partidas" });
        }
    },

    async atualizar(req, res) {
    try {
        const { id } = req.params;
        const { vencedor_id, perdedor_id, local, data } = req.body; // alterado aqui

        const partida = await Partida.findByPk(id);
        if (!partida) {
            return res.status(404).json({ erro: "Partida não encontrada" });
        }

        await partida.update({ vencedor_id, perdedor_id, local, data }); // alterado aqui
        return res.json(partida);
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao atualizar partida" });
    }
},

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const deletado = await Partida.destroy({ where: { id } });
            if (deletado) return res.json({ mensagem: "Partida removida" });
            return res.status(404).json({ erro: "Partida não encontrada" });
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao excluir partida" });
        }
    }
};