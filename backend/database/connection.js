const { Sequelize } = require('sequelize');
require('dotenv').config();

// Ele vai tentar usar a string completa do Render, se não tiver, usa a local
const sequelize = new Sequelize(process.env.DATABASE_URL || 'sua_string_local_aqui', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

module.exports = sequelize;