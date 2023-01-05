const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Message = sequelize.define('message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user: {type: DataTypes.STRING},
    text: {type: DataTypes.STRING},
    idRoom: {type: DataTypes.STRING},
    event: {type: DataTypes.STRING}
})

const Chat = sequelize.define('chats',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userCreator:{type: DataTypes.STRING},
    secondUser: {type: DataTypes.STRING},
    users: {type: DataTypes.STRING, unique: true},
    idRoom: {type: DataTypes.STRING},
    lastMessage: {type: DataTypes.STRING, defaultValue: ''}
})


const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    img:{type: DataTypes.STRING, defaultValue: 'none'},
    
})

module.exports={
    Message,
    User,
    Chat
}