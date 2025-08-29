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
exports.CatchError = CatchError;
const handle_error_1 = require("../utils/handle_error");
function CatchError(errorCb) {
    return (_, __, descriptor) => {
        const originalValue = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield originalValue.apply(this, args);
                }
                catch (error) {
                    yield (errorCb === null || errorCb === void 0 ? void 0 : errorCb(args[0], args[1]));
                    return (0, handle_error_1.handle_error)(args[1], error);
                }
            });
        };
    };
}
