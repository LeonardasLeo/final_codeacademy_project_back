import {NextFunction, Request, RequestHandler, Response} from "express";
import {IncomingDataTypes, JwtData, RequestWithData, ResSendFunction, UserTypes} from "../types";
import exp from "constants";
import {JwtPayload} from "jsonwebtoken";
const bcrypt = require('bcrypt')
const userDb = require('../modules/userSchema')
const jwt = require('jsonwebtoken')

type DataToToken = {
    username: string,
    profilePic: string
}
const resSend: ResSendFunction = (res, error, message, data) => {
    res.send({error, data, message})
}

export const authorizeRegister: RequestHandler = async (req: RequestWithData, res: Response, next: NextFunction): Promise<void> => {
    const {username, password}: IncomingDataTypes.RegisterAndLoginData = req.body
    const isUserInDb = await userDb.findOne({username})
    if (isUserInDb) return resSend(res, true, 'Username taken', null)
    req.hash = await bcrypt.hash(password, 10)
    next()
}

export const authorizeLogin: RequestHandler = async (req: RequestWithData, res: Response, next: NextFunction): Promise<void> => {
    const {username, password}: IncomingDataTypes.RegisterAndLoginData = req.body
    const userInDb: UserTypes.User = await userDb.findOne({username})
    if (!userInDb) return resSend(res, true, 'User doesnt exist', null)
    const isPasswordCorrect: boolean = await bcrypt.compare(password, userInDb.password)
    if (isPasswordCorrect){
        const user: DataToToken = {
            username: userInDb.username,
            profilePic: userInDb.profilePic
        }
        req.username = userInDb.username
        req.token = jwt.sign(user, process.env.JWT_SECRET)
        next()
    }else{
        return resSend(res, true, 'Password incorrect', null)
    }
}

export const authorize: RequestHandler = (req: RequestWithData, res: Response, next: NextFunction): void => {
    const token: string | undefined = req.headers.authorization
    if (token){
        jwt.verify(token, process.env.JWT_SECRET, (err: Error | null, data: JwtData): void => {
            if (err) return resSend(res, true, 'Verification error', null)
            req.username = data.username
            next()
        })
    }else{
        resSend(res, true, 'Authorization token missing', null)
    }
}

