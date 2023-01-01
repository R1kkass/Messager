const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const {User, Chat} = require('../models/model')
const jwt = require('jsonwebtoken')
const {Op} = require('sequelize')

class ChatController{
    async create(req, res, next){
        try{
            const {email, secondEmail} = req.body
            const add = `${email}&${secondEmail}`
            const date = Date.now()
            const find = await Chat.findOne({where: {users:add}})
            if(find){
                return res.json({find:'error'})
            }
            const response = await Chat.create({userCreator:email,secondUser: secondEmail, users: add, idRoom: date})
            return res.json({response:response})
        }catch(e){
            return ApiError.badRequest(e.message)
        }
    }

    async getAll(req, res){
        try{
        const {email} = req.query
        const user = await Chat.findAll({where: {
            [Op.or]: [{ userCreator: email }, { secondUser: email }],
        }})
        console.log(user);
        return res.json({user})
        }catch(e){
            return ApiError.badRequest(e.message)
        }
    }
}

module.exports = new ChatController()