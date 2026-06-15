const bcrypt = require('bcrypt');
const User = require('../models/Usuario');

const UsuarioController = {
  async criar(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
      }

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ erro: 'E-mail já cadastrado.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const novoUsuario = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user'
      });

      return res.status(201).json({
        id: novoUsuario.id,
        name: novoUsuario.name,
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