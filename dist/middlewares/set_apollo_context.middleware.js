"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.set_apollo_context = void 0;
const http_exception_1 = require("../core/http_exception");
const users_1 = require("../modules/users");
const jsonwebtoken_1 = require("jsonwebtoken");
const generics_1 = require("../types/generics");
const set_apollo_context = (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
    const access_token = req.signedCookies[generics_1.AccessTokenCookie] || req.cookies[generics_1.AccessTokenCookie];
    if (!access_token) {
        throw new http_exception_1.HttpException(401, "UNAUTHORIZED");
    }
    const decoded_token = (0, jsonwebtoken_1.decode)(access_token);
    if (!decoded_token) {
        throw new http_exception_1.HttpException(401, "UNAUTHORIZED");
    }
    const { id } = decoded_token;
    const user = yield users_1.UsersModel.findById(id);
    return { user };
});
exports.set_apollo_context = set_apollo_context;
