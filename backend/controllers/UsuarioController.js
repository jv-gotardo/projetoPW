const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
      }

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
      }

      const token = jwt.sign(
        { id: usuario.id, role: usuario.role },
        process.env.JWT_SECRET || 'fallback_secret_local',
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role
        }
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro interno ao realizar login.' });
    }
  },

  async obterPerfil(req, res) {
    try {
      const { id } = req.usuario; 

      const usuario = await Usuario.findByPk(id, {
        attributes: ['id', 'nome', 'email', 'role']
      });

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro interno ao obter dados do perfil.' });
    }
  },

  async atualizarPerfil(req, res) {
    try {
      const { id } = req.usuario; 
      const { nome, email, senha } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      if (nome) usuario.nome = nome;
      if (email) usuario.email = email;

      if (senha) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(senha, salt);
      }

      await usuario.save();

      return res.status(200).json({
        mensagem: 'Perfil atualizado com sucesso!',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro interno ao atualizar perfil.' });
    }
  }
};

module.exports = UsuarioController;