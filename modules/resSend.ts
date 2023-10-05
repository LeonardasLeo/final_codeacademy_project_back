import {Response} from "express";

export const resSend = (res: Response, error: boolean, message: string | null, data: any): void => {
    res.send({error, data, message})
}
