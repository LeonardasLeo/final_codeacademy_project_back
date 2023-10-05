import {Request} from "express";
import {JwtPayload} from "jsonwebtoken";
import {Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

export interface RequestWithData extends Request {
    hash?: string
    token?: string
    username?: string
}

export namespace IncomingDataTypes {
    export type RegisterAndLoginData = {
        username: string
        password: string
    }
    export type PostData = {
        title: string
        image: string
    }
    export type MessageData = {
        messageValue: string
        to: UserTypes.User
    }
    export type SocketCommunicationData = {
        roomName: string
        userOne: UserTypes.User
        userTwo: UserTypes.User
    }

}

export interface JwtData extends JwtPayload {
    username: string
    profilePic: string
}

export namespace UserTypes{
    export type Comment = {
        username: string
        comment: string
        likes: number
        dislikes: number
    }
    export type Post = {
        _id: string
        image: string
        title: string
        likes: number
        dislikes: number
        comments: Comment[]
        timestamp: number
    }
    export type User = {
        _id: string
        username: string
        password: string
        profilePic: string
        messages: object
    }
    export type Message = {
        sender: string
        value: string
    }
}

export type SocketType = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>