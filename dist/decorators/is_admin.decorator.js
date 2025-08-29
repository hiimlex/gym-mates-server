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
exports.IsAdmin = IsAdmin;
const http_exception_1 = require("../core/http_exception");
function IsAdmin() {
    return (_, __, descriptor) => {
        const originalValue = descriptor.value;
        descriptor.value = function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                const { sudo } = req.body;
                if (sudo !== process.env.SUDO_KEY) {
                    throw new http_exception_1.HttpException(403, "FORBIDDEN");
                }
                return yield originalValue.apply(this, [req, res, next]);
            });
        };
    };
}
