import {Router} from "express";
import {
    addPost,
    changePassword,
    changeProfilePic, comment, deletePost, dislikeComment, dislikePost, getSinglePost, getSingleUser,
    getUserData, likeComment,
    likePost,
    login,
    register, sendMessage
} from "../controllers/controller";
import {authorize, authorizeLogin, validateImageLink} from "../middleware/middleware";
const {authorizeRegister} = require('../middleware/middleware')

const router: Router = Router()

router.post('/register', authorizeRegister, register)
router.post('/login', authorizeLogin, login)
router.get('/getUserData', authorize, getUserData)
router.post('/changePassword', authorize, changePassword)
router.post('/changeProfilePic', authorize, validateImageLink, changeProfilePic)
router.post('/addPost', authorize, validateImageLink, addPost)
router.post('/likePost', authorize, likePost)
router.post('/dislikePost', authorize, dislikePost)
router.post('/sendMessage', authorize, sendMessage)
router.post('/getSinglePost', authorize, getSinglePost)
router.post('/getSingleUser', authorize, getSingleUser)
router.post('/comment', authorize, comment)
router.post('/likeComment', authorize, likeComment)
router.post('/dislikeComment', authorize, dislikeComment)
router.post('/deletePost', authorize, deletePost)

module.exports = router