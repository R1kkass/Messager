const ws = require('ws')
const express = require('express')
const sequelize = require('./db')
const app = express()
const WSServer = require('express-ws')(app)
const wss = WSServer.getWss()
const models = require('./models/model')
const WebSock = require("./websockets/websockets")
const { wsCall } = require('./websockets/switchCaseWS')


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
                console.log(ws.id);
                broadcastMessage(message)
                break
            case "message":
                addMessage(message)
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

async function addMessage(message){
    const msg  = await models.Message.create({user: message.username, text: message.text, idRoom: message.id, event: message.event})
}

async function query(id, message){
    let page = 1
    let limit = message.limit
    let offset = limit*page-limit
    
    const msg = await models.Message.findAndCountAll({where: {idRoom: id}, limit, offset, order: [["id","DESC"]]})
    .then((m)=>{
        return(m)
    })
    return(msg);
}


async function broadcastMessage(message, id){
    limit =  message.limit || 10
    page = 1
    offset = page * limit - limit
    
    wss.clients.forEach((client)=>{
        query(client.id || 0, message)
        .then((e)=>client.send(JSON.stringify(e)))
    })
}


start()