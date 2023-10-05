"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
require('dotenv').config();
const mongoose = require('mongoose');
const app = (0, express_1.default)();
exports.server = (0, node_http_1.createServer)(app);
const router = require('./router/router');
const io = new socket_io_1.Server((exports.server), {
    cors: {
        origin: "*"
    }
});
require('./modules/sockets')(io);
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/', router);
mongoose.connect(process.env.DB_KEY)
    .then((res) => console.log('connected'))
    .catch((e) => console.log(e));
exports.server.listen(3001);
