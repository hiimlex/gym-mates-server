"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
const generics_1 = require("../../types/generics");
class HttpException extends Error {
    constructor(status, message, content) {
        super();
        if (generics_1.SystemErrors[message]) {
            super.message = generics_1.SystemErrors[message];
        }
        this.message = message.toString();
        this.status = status;
        this.content = content;
    }
}
exports.HttpException = HttpException;
