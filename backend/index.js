const express = require('express');
const cors = require('cors');
const sequelize = require('./database/connection.js');

const Categoria = require('./models/Categoria');
const Jogador = require('./models/Jogador');
const Partida = require('./models/Partida');

const app = express();

app.use(express.json());
app.use(cors());       

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});

const CategoriaController = require('./controllers/CategoriaController');

app.post('/categorias', CategoriaController.criar);       
app.get('/categorias', CategoriaController.listar);        
app.put('/categorias/:id', CategoriaController.atualizar); 
app.delete('/categorias/:id', CategoriaController.excluir); 

const JogadorController = require('./controllers/JogadorController');

app.post('/jogadores', JogadorController.criar);
app.get('/jogadores', JogadorController.listar);
app.put('/jogadores/:id', JogadorController.atualizar);
app.delete('/jogadores/:id', JogadorController.excluir);

const PartidaController = require('./controllers/PartidaController');

app.post('/partidas', PartidaController.criar);
app.get('/partidas', PartidaController.listar);
app.put('/partidas/:id', PartidaController.atualizar); 
app.delete('/partidas/:id', PartidaController.excluir);

app.get('/', (req, res) => {
    res.json({ mensagem: "API do Campeonato de Tênis de Mesa rodando com sucesso!" });
});

async function conectarBanco() {
    try {
        await sequelize.sync({ force: false }); 
        console.log('Conexão com o banco do Supabase estabelecida e tabelas sincronizadas.');
        
        app.listen(PORT, () => {
            console.log(`Servidor iniciado na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
}

conectarBanco();