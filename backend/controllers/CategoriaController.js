const Categoria = require('../models/Categoria');

module.exports = {
    async criar(req, res) {
        try {
            const { nome, nivel } = req.body;
            const novaCategoria = await Categoria.create({ nome, nivel });
            return res.status(201).json(novaCategoria);
        } catch (error) {
            console.error("ERRO REAL:", error); // Isso vai mostrar no seu terminal o motivo exato
            return res.status(500).json({ erro: error.message });
        }
    },

    async listar(req, res) {
        try {
            const categorias = await Categoria.findAll();
            return res.json(categorias);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao listar categorias" });
        }
    },

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, nivel } = req.body;
            
            const categoria = await Categoria.findByPk(id);
            if (!categoria) {
                return res.status(404).json({ erro: "Categoria não encontrada" });
            }

            await categoria.update({ nome, nivel });
            return res.json(categoria);
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao atualizar categoria" });
        }
    },

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const deletado = await Categoria.destroy({ where: { id } });
            
            if (deletado) {
                return res.json({ mensagem: "Categoria excluída com sucesso" });
            }
            return res.status(404).json({ erro: "Categoria não encontrada" });
        } catch (error) {
            return res.status(500).json({ erro: "Erro ao excluir categoria" });
        }
    }
};