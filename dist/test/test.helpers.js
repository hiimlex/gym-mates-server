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
exports.test_get_user_and_cookie = void 0;
const __mocks__1 = require("../__mocks__");
const generics_1 = require("../types/generics");
const test_get_user_and_cookie = (test_agent) => __awaiter(void 0, void 0, void 0, function* () {
    const mock_user = (0, __mocks__1.create_user_mock)();
    const { user, access_token } = (yield test_agent.post(generics_1.ApiPrefix + generics_1.Endpoints.AuthSignUp).send({
        name: mock_user.name,
        email: mock_user.email,
        password: mock_user.password,
    })).body;
    mock_user.access_token = access_token;
    return {
        access_token,
        user,
        mock_user,
    };
});
exports.test_get_user_and_cookie = test_get_user_and_cookie;
