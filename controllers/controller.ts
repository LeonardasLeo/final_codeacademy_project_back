import {RequestHandler, Response} from "express";
import {IncomingDataTypes, RequestWithData, ResSendFunction, UserTypes} from "../types";
const userDb = require('../modules/userSchema')
const bcrypt = require('bcrypt')

const resSend: ResSendFunction = (res, error, message, data): void => {
    res.send({error, data, message})
}
export const register: RequestHandler = (req: RequestWithData, res: Response): void => {
    const {username}: IncomingDataTypes.RegisterAndLoginData = req.body
    const {hash} = req
    const user: UserTypes.User = new userDb({
        username,
        password: hash,
        profilePic: 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
        messages: {},
        myPosts: []
    })
    // @ts-ignore
    user.save()
        .then((): void => {
            resSend(res, false, 'saved user to db', null)
        })
        .catch((): void => {
            resSend(res, true, 'failed to save user to db', null)
        })
}

export const login: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {token, username} = req
    const user: UserTypes.User = await userDb.findOne({username}, {password: 0})
    resSend(res, false, null, {user, token})
}

export const getUserData: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {username} = req
    const user: UserTypes.User = await userDb.findOne({username}, {password: 0})
    resSend(res, false, null, user)
}

export const changePassword: RequestHandler = async (req: RequestWithData, res: Response): Promise<void> => {
    const {username} = req
    const {passwordOne}: {passwordOne: string} = req.body
    const newPassword: string = await bcrypt.hash(passwordOne, 10)
    await userDb.findOneAndUpdate({username}, {$set: {password: newPassword}})
    resSend(res, false, 'Password changed', null)
}