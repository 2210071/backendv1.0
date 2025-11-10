const { Sequelize } = require('sequelize');
const initModels = require('../modelos/init-models');
const dotenv = require('dotenv');

dotenv.config();

const isLocal = process.env.NODE_ENV !== 'production'; // Detecta si estás local
let databaseUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: isLocal
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          }
        }
      : {}, // En Render, no pongas ssl
});

sequelize.authenticate()
  .then(() => console.log('Conectado a la base de datos!'))
  .catch(err => console.error('Error al conectar:', err));

const db = initModels(sequelize);
module.exports = { sequelize, db };
