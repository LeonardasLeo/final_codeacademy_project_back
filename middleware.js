"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authorizeLogin = exports.authorizeRegister = void 0;
const bcrypt = require('bcrypt');
const userDb = require('./modules/userSchema');
const jwt = require('jsonwebtoken');
const resSend = (res, error, message, data) => {
    res.send({ error, data, message });
};
const authorizeRegister = async (req, res, next) => {
    const { username, password } = req.body;
    const isUserInDb = await userDb.findOne({ username });
    if (isUserInDb)
        return resSend(res, true, 'Username taken', null);
    req.hash = await bcrypt.hash(password, 10);
    next();
};
exports.authorizeRegister = authorizeRegister;
const authorizeLogin = async (req, res, next) => {
    const { username, password } = req.body;
    const userInDb = await userDb.findOne({ username });
    if (!userInDb)
        return resSend(res, true, 'User doesnt exist', null);
    const isPasswordCorrect = await bcrypt.compare(password, userInDb.password);
    if (isPasswordCorrect) {
        const user = {
            username: userInDb.username,
            profilePic: userInDb.profilePic
        };
        req.username = userInDb.username;
        req.token = jwt.sign(user, process.env.JWT_SECRET);
        next();
    }
    else {
        return resSend(res, true, 'Password incorrect', null);
    }
};
exports.authorizeLogin = authorizeLogin;
const authorize = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err)
                return resSend(res, true, 'Verification error', null);
            req.username = data.username;
            next();
        });
    }
    else {
        resSend(res, true, 'Authorization token missing', null);
    }
};
exports.authorize = authorize;
