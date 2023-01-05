
const {Message} = require("../models/model")

class WebSock{
    async delete(id, user){
        try{
        console.log(id, "=========================");
        const msg = await Message.destroy({where: {id, user}}) 
        return (msg)
        }catch(e){
            console.log(e);
        }

    }
}

module.exports = new WebSock()