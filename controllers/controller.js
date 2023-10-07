"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dislikeComment = exports.likeComment = exports.comment = exports.getSingleUser = exports.getSinglePost = exports.sendMessage = exports.dislikePost = exports.likePost = exports.addPost = exports.changeProfilePic = exports.changePassword = exports.getUserData = exports.login = exports.register = void 0;
const resSend_1 = require("../modules/resSend");
const postInteractionHanlder_1 = require("./postInteractionHanlder");
const userDb = require('../modules/userSchema');
const postDb = require('../modules/postSchema');
const bcrypt = require('bcrypt');
const getAllData = async (res, username) => {
    const user = await userDb.findOne({ username }, { password: 0 });
    if (!user)
        return (0, resSend_1.resSend)(res, true, 'User not found in database', null);
    const allPosts = await postDb.find();
    let allUsers = await userDb.find();
    allUsers = allUsers.filter((x) => x.username !== username);
    return { user, allPosts, allUsers };
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
        (0, resSend_1.resSend)(res, false, 'saved user to db', null);
    })
        .catch(() => {
        (0, resSend_1.resSend)(res, true, 'failed to save user to db', null);
    });
};
exports.register = register;
const login = async (req, res) => {
    const { token, username } = req;
    const data = await getAllData(res, username);
    if (!data)
        return;
    const { user, allPosts, allUsers } = data;
    (0, resSend_1.resSend)(res, false, null, { user, token, allPosts, allUsers });
};
exports.login = login;
const getUserData = async (req, res) => {
    const { username } = req;
    const data = await getAllData(res, username);
    if (!data)
        return;
    const { user, allPosts, allUsers } = data;
    (0, resSend_1.resSend)(res, false, null, { user, allUsers, allPosts });
};
exports.getUserData = getUserData;
const changePassword = async (req, res) => {
    const { username } = req;
    const { passwordOne } = req.body;
    const newPassword = await bcrypt.hash(passwordOne, 10);
    const updatedUser = await userDb.findOneAndUpdate({ username }, { $set: { password: newPassword } });
    if (!updatedUser)
        return (0, resSend_1.resSend)(res, true, 'User not found in database', null);
    (0, resSend_1.resSend)(res, false, 'Password changed', null);
};
exports.changePassword = changePassword;
const changeProfilePic = async (req, res) => {
    const { username } = req;
    const { image } = req.body;
    const updatedUser = await userDb.findOneAndUpdate({ username }, { $set: { profilePic: image } }, { new: true, password: 0 });
    if (!updatedUser)
        return (0, resSend_1.resSend)(res, true, 'User not found in database', null);
    (0, resSend_1.resSend)(res, false, 'Picture changed', updatedUser);
};
exports.changeProfilePic = changeProfilePic;
const addPost = async (req, res) => {
    const { username } = req;
    const { title, image } = req.body;
    const post = new postDb({
        username,
        image,
        title,
        likes: [],
        dislikes: [],
        comments: [],
        timestamp: new Date()
    });
    // @ts-ignore
    post.save()
        .then(() => {
        (0, resSend_1.resSend)(res, false, 'post added to db', null);
    })
        .catch(() => {
        (0, resSend_1.resSend)(res, true, 'failed to add post to db', null);
    });
};
exports.addPost = addPost;
const likePost = async (req, res) => {
    const { username } = req;
    const { id } = req.body;
    await (0, postInteractionHanlder_1.togglePostInteraction)(username, id, res, 'likes');
};
exports.likePost = likePost;
const dislikePost = async (req, res) => {
    const { username } = req;
    const { id } = req.body;
    await (0, postInteractionHanlder_1.togglePostInteraction)(username, id, res, 'dislikes');
};
exports.dislikePost = dislikePost;
const sendMessage = async (req, res) => {
    const { username } = req;
    const { messageValue, to } = req.body;
    if (!username)
        return (0, resSend_1.resSend)(res, true, 'Couldn\'t authorize sender', null);
    const message = {
        sender: username,
        value: messageValue,
        timestamp: new Date()
    };
    await userDb.findOneAndUpdate({ username: to.username }, { $push: { [`messages.${username}`]: message } });
    await userDb.findOneAndUpdate({ username }, { $push: { [`messages.${to.username}`]: message } });
    (0, resSend_1.resSend)(res, false, 'Message sent', null);
};
exports.sendMessage = sendMessage;
const getSinglePost = async (req, res) => {
    const { id } = req.body;
    const post = await postDb.findOne({ _id: id });
    if (!post)
        return (0, resSend_1.resSend)(res, true, 'Couldn\'t get post', null);
    (0, resSend_1.resSend)(res, false, null, post);
};
exports.getSinglePost = getSinglePost;
const getSingleUser = async (req, res) => {
    const { username } = req.body;
    const user = await userDb.findOne({ username });
    if (!user)
        return (0, resSend_1.resSend)(res, true, 'Couldn\'t get user', null);
    (0, resSend_1.resSend)(res, false, null, user);
};
exports.getSingleUser = getSingleUser;
const comment = async (req, res) => {
    const { comment, id } = req.body;
    const post = await postDb.findOneAndUpdate({ _id: id }, { $push: { comments: comment } }, { new: true });
    if (!post)
        return (0, resSend_1.resSend)(res, true, 'Failed to add comment', null);
    (0, resSend_1.resSend)(res, false, 'Comment added', null);
};
exports.comment = comment;
const likeComment = async (req, res) => {
    const { username } = req;
    const { commentId } = req.body;
    await (0, postInteractionHanlder_1.toggleCommentInteraction)(username, commentId, res, 'likes');
};
exports.likeComment = likeComment;
const dislikeComment = async (req, res) => {
    const { username } = req;
    const { commentId } = req.body;
    const post = await postDb.findOne({ 'comments.id': commentId });
    await (0, postInteractionHanlder_1.toggleCommentInteraction)(username, commentId, res, 'dislikes');
};
exports.dislikeComment = dislikeComment;
