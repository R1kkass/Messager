const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    'messager',
    'postgres',
    "25122004",
    {
        dialect: 'postgres',
        host: 'localhost',
        port: 5000 
    }
)