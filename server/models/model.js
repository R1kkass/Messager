const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Message = sequelize.define('message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user: {type: DataTypes.STRING},
    text: {type: DataTypes.STRING},
    idRoom: {type: DataTypes.INTEGER},
    event: {type: DataTypes.STRING}
})

module.exports={
    Message
}