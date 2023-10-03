import {Router} from "express";
import {changePassword, getUserData, login, register} from "../controllers/controller";
import {authorize, authorizeLogin} from "../middleware/middleware";
const {authorizeRegister} = require('../middleware/middleware')

const router: Router = Router()

router.post('/register', authorizeRegister, register)
router.post('/login', authorizeLogin, login)
router.get('/getUserData', authorize, getUserData)
router.post('/changePassword', authorize, changePassword)

module.exports = router