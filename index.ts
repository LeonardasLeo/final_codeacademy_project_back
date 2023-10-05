import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";
import {createServer} from 'node:http'
import {Server} from "socket.io";
require('dotenv').config()
const mongoose = require('mongoose')
const app = express()
export const server = createServer(app)
const router = require('./router/router')

const io = new Server((server),{
    cors: {
        origin: "*"
    }
});

require('./modules/sockets')(io)


app.use(cors())
app.use(bodyParser.json())
app.use('/', router)

mongoose.connect(process.env.DB_KEY)
    .then((res: Response) => console.log('connected'))
    .catch((e: Error) => console.log(e))

server.listen(3001)
