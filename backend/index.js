const express = require('express');
const cors = require('cors');
const sequelize = require('./database/connection.js');

const Categoria = require('./models/Categoria');
const Jogador = require('./models/Jogador');
const Partida = require('./models/Partida');

const app = express();

app.use(express.json());
app.use(cors());       

const PORT = process.env.PORT || 3002;

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