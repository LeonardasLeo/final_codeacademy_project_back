"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resSend = void 0;
const resSend = (res, error, message, data) => {
    res.send({ error, data, message });
};
exports.resSend = resSend;
