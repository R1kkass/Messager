const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const chatRouter = require('./chatRouter')
const settingRouter = require('./settingRouter')

router.use('/user', userRouter)
router.use('/chat', chatRouter)
router.use('/settinguser', settingRouter)

module.exports=router