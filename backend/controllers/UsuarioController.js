const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const UsuarioController = {
  async criar(req, res) {
    try {
      const { nome, email, senha, role } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
      }

      const usuarioExiste = await Usuario.findOne({ where: { email } });
      if (usuarioExiste) {
        return res.status(400).json({ erro: 'E-mail já cadastrado.' });
      }

      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha: senhaCriptografada,
        role: role || 'user'
      });

      return res.status(201).json({
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        role: novoUsuario.role
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro interno ao criar usuário.' });
    }
  }
};

module.exports = UsuarioController;