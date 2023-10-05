import {NextFunction, Request, RequestHandler, Response} from "express";
import {IncomingDataTypes, JwtData, RequestWithData, UserTypes} from "../types";

import {resSend} from "../modules/resSend";
const bcrypt = require('bcrypt')
const userDb = require('../modules/userSchema')
const jwt = require('jsonwebtoken')

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
        req.username = userInDb.username
        req.token = jwt.sign(userInDb.username, process.env.JWT_SECRET)
        next()
    }else{
        return resSend(res, true, 'Password incorrect', null)
    }
}

export const authorize: RequestHandler = (req: RequestWithData, res: Response, next: NextFunction): void => {
    const token: string | undefined = req.headers.authorization
    if (token){
        jwt.verify(token, process.env.JWT_SECRET, (err: Error | null, data: string): void => {
            if (err) return resSend(res, true, 'Verification error', null)
            req.username = data
            next()
        })
    }else{
        resSend(res, true, 'Authorization token missing', null)
    }
}

export const validateImageLink: RequestHandler = (req: RequestWithData, res: Response, next: NextFunction): void => {
    const {image}: {image: string} = req.body
    function validURL(str: string): boolean {
        let pattern: RegExp = new RegExp('^(https?:\\/\\/)?'+
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
            '((\\d{1,3}\\.){3}\\d{1,3}))'+
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
            '(\\?[;&a-z\\d%_.~+=-]*)?'+
            '(\\#[-a-z\\d_]*)?$','i');
        return pattern.test(str);
    }
    if (!validURL(image)) return resSend(res, true, 'Image link invalid', null)
    next()
}
