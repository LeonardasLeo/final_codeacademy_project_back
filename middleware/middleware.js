"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImageLink = exports.authorize = exports.authorizeLogin = exports.authorizeRegister = void 0;
const resSend_1 = require("../modules/resSend");
const bcrypt = require('bcrypt');
const userDb = require('../modules/userSchema');
const jwt = require('jsonwebtoken');
const authorizeRegister = async (req, res, next) => {
    const { username, password } = req.body;
    const isUserInDb = await userDb.findOne({ username });
    if (isUserInDb)
        return (0, resSend_1.resSend)(res, true, 'Username taken', null);
    req.hash = await bcrypt.hash(password, 10);
    next();
};
exports.authorizeRegister = authorizeRegister;
const authorizeLogin = async (req, res, next) => {
    const { username, password } = req.body;
    const userInDb = await userDb.findOne({ username });
    if (!userInDb)
        return (0, resSend_1.resSend)(res, true, 'User doesnt exist', null);
    const isPasswordCorrect = await bcrypt.compare(password, userInDb.password);
    if (isPasswordCorrect) {
        req.username = userInDb.username;
        req.token = jwt.sign(userInDb.username, process.env.JWT_SECRET);
        next();
    }
    else {
        return (0, resSend_1.resSend)(res, true, 'Password incorrect', null);
    }
};
exports.authorizeLogin = authorizeLogin;
const authorize = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err)
                return (0, resSend_1.resSend)(res, true, 'Verification error', null);
            req.username = data;
            next();
        });
    }
    else {
        (0, resSend_1.resSend)(res, true, 'Authorization token missing', null);
    }
};
exports.authorize = authorize;
const validateImageLink = (req, res, next) => {
    const { image } = req.body;
    function validURL(str) {
        let pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return pattern.test(str);
    }
    if (!validURL(image))
        return (0, resSend_1.resSend)(res, true, 'Image link invalid', null);
    next();
};
exports.validateImageLink = validateImageLink;
