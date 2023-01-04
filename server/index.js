const ws = require('ws')
const express = require('express')
const sequelize = require('./db')
const app = express()
const WSServer = require('express-ws')(app)
const wss = WSServer.getWss()
const models = require('./models/model')
const WebSock = require("./websockets/websockets")
const router = require('./routes/index')
const WebSocketController = require('./controller/webSocket')
const { wsCall } = require('./websockets/switchCaseWS')
const path = require('path')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const webSocket = require('./controller/webSocket')
const {Op} = require('sequelize')
const ApiError = require('./error/ApiError')
const authMiddleware = require('./middleware/authMiddleware')


app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'static')))
app.use(fileUpload())
app.use('/api', router)

const start = async ()=>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(5001, () => console.log(`server started on PORT ${5001}`))
    }catch(e){
        console.log(e);
    }
}



app.ws('/con', (ws,req)=>{
    ws.on("message", function(message){
        message = JSON.parse(message)
        switch(message.event){
            case "connection": 
                ws.id = message.id
                broadcastMessage(message)
                break
            case "message":
                WebSocketController.addMessage(message)
                .then(()=>{
                    broadcastMessage(message)
                })
                break
            case "limit":
                broadcastMessage(message)
                break
            case "delete":
                WebSock.delete(message.idDelete, message.user)
                .then(()=>{
                    broadcastMessage(message)
                })
                break
        }
    })
})


async function broadcastMessage(message, id){
    try{
    limit =  message.limit || 10
    page = 1
    offset = page * limit - limit
    const response = await models.Chat.findOne({where:{
        [Op.and]: [
            { idRoom: message.id }, 
        {userCreator: message.username},
    ]}})
    const response2 = await models.Chat.findOne({where:{
        [Op.and]: [
        { idRoom: message.id }, 
        {secondUser: message.username},
    ]}})
    console.log(response, response2);
    if(response || response2){
        wss.clients.forEach((client)=>{
            console.log(client.id);
            if(client.id == message.id){
            WebSocketController.query(client.id || 0, message)
            .then((e)=>client.send(JSON.stringify(e)))
            }
        })
    }
    
    }catch(e){
        return ApiError.badRequest(e)
    }
}


start()