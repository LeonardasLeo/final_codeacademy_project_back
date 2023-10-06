"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { verifyToken } = require('../middleware/socketMiddleware');
const postDb = require('../modules/postSchema');
const userDb = require('../modules/userSchema');
module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('userConnected', (val) => {
            const token = val;
            if (!token) {
                console.log('Socket connection refused');
            }
            else {
                const username = verifyToken(token);
                if (!username)
                    return console.log('Socket connection refused');
                socket.join(`${username}-room`);
            }
        });
        socket.on('profilePictureChanged', async () => {
            const allUsers = await userDb.find();
            io.emit('updateAllUsers', allUsers);
        });
        socket.on('postInteraction', async () => {
            const allPosts = await postDb.find();
            io.emit('updatePosts', allPosts);
        });
        socket.on('requestJoinRoomFromClient', async ({ roomName, userOne, userTwo }) => {
            socket.join(roomName);
            io.to(`${userTwo.username}-room`).emit('requestRoomJoinFromServer', { roomName, userOne, userTwo });
        });
        socket.on('joinRoom', (roomName) => {
            socket.join(roomName);
        });
        socket.on('sendMessage', async ({ roomName, userOne, userTwo }) => {
            const updatedUserOne = await userDb.findOne({ username: userOne.username });
            const updatedUserTwo = await userDb.findOne({ username: userTwo.username });
            console.log(roomName);
            io.to(roomName).emit('updateUsers', { userOne: updatedUserOne, userTwo: updatedUserTwo });
        });
    });
};
