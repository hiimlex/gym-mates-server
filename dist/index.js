"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
dotenv_1.default.config();
const server = new app_1.Server();
exports.server = server;
server.setup();
server.start();
