
const {Message} = require("../models/model")

class WebSock{
    async delete(id, user){
        console.log(id, "=========================");
        const msg = await Message.destroy({where: {id, user}}) 
        return (msg)
    }
}

module.exports = new WebSock()