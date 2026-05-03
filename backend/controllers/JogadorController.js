const Jogador = require('../models/Jogador');
const Categoria = require('../models/Categoria');

module.exports = {
    async criar(req, res) {
        try {
            const { nome, idade, categoria_id } = req.body;

            const categoria = await Categoria.findByPk(categoria_id);
            if (!categoria) {
                return res.status(400).json({ erro: "Categoria não encontrada. Não é possível criar o jogador." });
            }

            const novoJogador = await Jogador.create({ nome, idade, categoria_id });
            return res.status(201).json(novoJogador);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: "Erro ao criar jogador" });
        }
    },

    async listar(req, res) {
        try {
            const jogadores = await Jogador.findAll({ include: Categoria });
            return res.json(jogadores);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao listar jogadores" });
        }
    },

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, idade, categoria_id } = req.body;

            const jogador = await Jogador.findByPk(id);
            if (!jogador) {
                return res.status(404).json({ erro: "Jogador não encontrado" });
            }

            await jogador.update({ nome, idade, categoria_id });
            return res.json(jogador);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao atualizar jogador" });
        }
    },

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const deletado = await Jogador.destroy({ where: { id } });
            if (deletado) return res.json({ mensagem: "Jogador excluído" });
            return res.status(404).json({ erro: "Jogador não encontrado" });
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao excluir jogador" });
        }
    }
};