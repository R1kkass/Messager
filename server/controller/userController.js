const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const {User} = require('../models/model')
const jwt = require('jsonwebtoken')


const generateJwt = (id, email, role, img) => {
    return jwt.sign(
        {id, email, role, img},
        'code',
        {expiresIn: '24h'}
    )
}

class UserController{
    async registration(req, res, next){
        try{
            console.log(req.body);
        const {email, password,role} = req.body
        console.log('tut2');
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        
        const user = await User.create({email, role, password: hashPassword})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }catch(e){
        return ApiError.badRequest(e.message)
    }
    }

    async login(req, res, next){
        try{
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role, user.img)
        return res.json({token})
    }catch(e){
        return ApiError.badRequest(e.message)
    }
    } 

    async check(req, res, next){
        // const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({message: 'ura'})
    } 

    async getOne(req, res){
        try{
        const {id} = req.body
        const user = await User.findOne({where: {email: id}})
        return res.json({user})
        }catch(e){
            return ApiError.badRequest(e.message)
        }
    }

    async getAll(req, res){
        try{
        const user = await User.findAll({})
        return res.json({user})
        }catch(e){
            return ApiError.badRequest(e.message)
        }
    }
}

module.exports = new UserController()