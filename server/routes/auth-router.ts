const express = require('express')
const authRouter = express.Router()
import {AuthController} from '../controllers/auth-controller'; //require('../controllers/auth-controller')

authRouter.post('/register', AuthController.registerUser)
authRouter.post('/login', AuthController.loginUser)
authRouter.get('/logout', AuthController.logoutUser)
authRouter.get('/loggedIn', AuthController.getLoggedIn)


export {authRouter}
//module.exports = router