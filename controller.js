"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getUserData = exports.login = exports.register = void 0;
const userDb = require('./modules/userSchema');
const bcrypt = require('bcrypt');
const resSend = (res, error, message, data) => {
    res.send({ error, data, message });
};
const register = (req, res) => {
    const { username } = req.body;
    const { hash } = req;
    const user = new userDb({
        username,
        password: hash,
        profilePic: 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
        messages: {},
        myPosts: []
    });
    // @ts-ignore
    user.save()
        .then(() => {
        resSend(res, false, 'saved user to db', null);
    })
        .catch(() => {
        resSend(res, true, 'failed to save user to db', null);
    });
};
exports.register = register;
const login = async (req, res) => {
    const { token, username } = req;
    const user = await userDb.findOne({ username }, { password: 0 });
    resSend(res, false, null, { user, token });
};
exports.login = login;
const getUserData = async (req, res) => {
    const { username } = req;
    const user = await userDb.findOne({ username }, { password: 0 });
    resSend(res, false, null, user);
};
exports.getUserData = getUserData;
const changePassword = async (req, res) => {
    const { username } = req;
    const { passwordOne } = req.body;
    const newPassword = await bcrypt.hash(passwordOne, 10);
    await userDb.findOneAndUpdate({ username }, { $set: { password: newPassword } });
    resSend(res, false, 'Password changed', null);
};
exports.changePassword = changePassword;
