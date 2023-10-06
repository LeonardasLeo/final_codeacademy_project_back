import {Server} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {IncomingDataTypes, SocketType, UserTypes} from "../types";
const {verifyToken} = require('../middleware/socketMiddleware')
const postDb = require('../modules/postSchema')
const userDb = require('../modules/userSchema')

module.exports = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void => {
    io.on('connection', (socket: SocketType): void => {
        socket.on('userConnected', (val: string) => {
            const token: string = val
            if (!token){
                console.log('Socket connection refused')
            }else{
                const username: string | undefined = verifyToken(token)
                if (!username) return console.log('Socket connection refused')
                socket.join(`${username}-room`)
            }
        })
        socket.on('profilePictureChanged', async (): Promise<void> => {
            const allUsers = await userDb.find()
            io.emit('updateAllUsers', allUsers)
        })
        socket.on('postInteraction', async (): Promise<void> => {
            const allPosts = await postDb.find()
            io.emit('updatePosts', allPosts)
        })
        socket.on('requestJoinRoomFromClient', async ({roomName, userOne , userTwo}: IncomingDataTypes.SocketCommunicationData): Promise<void> => {
            socket.join(roomName)
            io.to(`${userTwo.username}-room`).emit('requestRoomJoinFromServer', {roomName, userOne, userTwo})
        })
        socket.on('joinRoom', (roomName: string): void => {
            socket.join(roomName)
        })
        socket.on('sendMessage', async ({roomName, userOne, userTwo}: IncomingDataTypes.SocketCommunicationData): Promise<void> => {
            const updatedUserOne: UserTypes.User = await userDb.findOne({username: userOne.username})
            const updatedUserTwo: UserTypes.User = await userDb.findOne({username: userTwo.username})
            console.log(roomName)
            io.to(roomName).emit('updateUsers', {userOne: updatedUserOne, userTwo: updatedUserTwo})
        })
    })
}