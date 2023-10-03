import {Response, Request} from "express";
import {JwtPayload} from "jsonwebtoken";

export interface RequestWithData extends Request {
    hash?: string
    token?: string
    username?: string
}

export namespace IncomingDataTypes {
    export type RegisterAndLoginData = {
        username: string,
        password: string,
    }
}

export interface JwtData extends JwtPayload {
    username: string,
    profilePic: string
}

export type ResSendFunction = (res: Response, error: boolean, message: string | null, data: any) => void

export namespace UserTypes{
    export type Comment = {
        username: string,
        comment: string,
        likes: number,
        dislikes: number
    }

    export type Post = {
        image: string,
        title: string,
        likes: number,
        dislikes: number,
        comments: Comment[]
    }

    export type User = {
        username: string,
        password: string,
        profilePic: string,
        messages: object,
        myPosts: Post[]
    }
}