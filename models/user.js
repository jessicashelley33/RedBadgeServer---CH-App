const db = require("../db");
const { DataTypes } = require('sequelize')

const UserModel = db.define('user', {
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        // validation and constraint to disallow empty entry
        unqiue: true,
        // allows no duplicates
    },
    userName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unqiue: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
        
    },


})

module.exports = UserModel

