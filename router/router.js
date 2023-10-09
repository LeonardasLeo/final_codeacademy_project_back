"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controllers/controller");
const middleware_1 = require("../middleware/middleware");
const { authorizeRegister } = require('../middleware/middleware');
const router = (0, express_1.Router)();
router.post('/register', authorizeRegister, controller_1.register);
router.post('/login', middleware_1.authorizeLogin, controller_1.login);
router.get('/getUserData', middleware_1.authorize, controller_1.getUserData);
router.post('/changePassword', middleware_1.authorize, controller_1.changePassword);
router.post('/changeProfilePic', middleware_1.authorize, middleware_1.validateImageLink, controller_1.changeProfilePic);
router.post('/addPost', middleware_1.authorize, middleware_1.validateImageLink, controller_1.addPost);
router.post('/likePost', middleware_1.authorize, controller_1.likePost);
router.post('/dislikePost', middleware_1.authorize, controller_1.dislikePost);
router.post('/sendMessage', middleware_1.authorize, controller_1.sendMessage);
router.post('/getSinglePost', middleware_1.authorize, controller_1.getSinglePost);
router.post('/getSingleUser', middleware_1.authorize, controller_1.getSingleUser);
router.post('/comment', middleware_1.authorize, controller_1.comment);
router.post('/likeComment', middleware_1.authorize, controller_1.likeComment);
router.post('/dislikeComment', middleware_1.authorize, controller_1.dislikeComment);
router.post('/deletePost', middleware_1.authorize, controller_1.deletePost);
module.exports = router;
