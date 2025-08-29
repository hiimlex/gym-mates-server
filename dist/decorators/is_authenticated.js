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
exports.IsAuthenticated = IsAuthenticated;
const http_exception_1 = require("../core/http_exception");
const journey_1 = require("../modules/journey");
const users_1 = require("../modules/users");
const jsonwebtoken_1 = require("jsonwebtoken");
function IsAuthenticated() {
    return (_, __, descriptor) => {
        const originalValue = descriptor.value;
        descriptor.value = function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const access_token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!access_token) {
                    throw new http_exception_1.HttpException(401, "UNAUTHORIZED");
                }
                const decoded_token = (0, jsonwebtoken_1.decode)(access_token);
                if (!decoded_token) {
                    throw new http_exception_1.HttpException(401, "UNAUTHORIZED");
                }
                const { id } = decoded_token;
                const user = yield users_1.UsersModel.findById(id);
                if (!user) {
                    throw new http_exception_1.HttpException(404, "USER_NOT_FOUND");
                }
                const journey = yield journey_1.JourneyModel.findById(user.journey);
                if (!journey) {
                    throw new http_exception_1.HttpException(404, "JOURNEY_NOT_FOUND");
                }
                res.locals.user = user;
                res.locals.journey = journey;
                return yield originalValue.apply(this, [req, res, next]);
            });
        };
    };
}
