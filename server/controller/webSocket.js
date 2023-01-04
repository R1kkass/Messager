const {User, Message} = require('../models/model')


class WebSocketController{

async addMessage(message){
    const msg  = await Message.create({user: message.username, text: message.text, idRoom: message.id, event: message.event})
}

async query(id, message){
    console.log(id);
    let page = 1
    let limit = message.limit
    let offset = limit*page-limit
    
    const msg = await Message.findAndCountAll({where: {idRoom: id}, limit, offset, order: [["id","DESC"]]})
    .then((m)=>{
        return(m)
    })
    return(msg);
}
}

module.exports = new WebSocketController