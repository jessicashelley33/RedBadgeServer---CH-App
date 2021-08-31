const { Sequelize } = require("sequelize");

const db = new Sequelize(process.env.DATABASE_URL || `postgresql://postgres${encodeURIComponent(process.env.PASS)}@localhost/<accountsModel>`, {
    dialect: 'postgres',
    ssl: process.env.ENVIRONMENT === 'production'
});

module.exports = db;
