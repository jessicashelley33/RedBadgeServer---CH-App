const db = require("../db");
const { DataTypes } = require('sequelize')

const LoginModel = db.define('login', {
    userName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = LoginModel
