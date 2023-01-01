const {User} = require('../models/model')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const {Op} = require('sequelize')
const chatController = require('./chatController')

class SettingController{
    async create(req, res, next){
        try{
        let {email} = req.body
        
        const {img} = req.files
        
        let fileName = uuid.v4() + '.jpg'
        
        const device = await User.update({img: fileName}, {where: {email: email}})
        
        console.log(img.length+'------------------------------')
        console.log(fileName);
        img.mv(path.resolve(__dirname, '..','static', fileName))
        return res.json(device)
    } catch (e){
        return (ApiError.badRequest(e.message))
    }
}}

module.exports = new SettingController()