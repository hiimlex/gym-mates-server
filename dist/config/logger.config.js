"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.add_mongo_transport = add_mongo_transport;
const winston_1 = __importDefault(require("winston"));
const winston_mongodb_1 = require("winston-mongodb");
const timezoneDate = () => {
    return new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
    });
};
const sensitiveFields = ["password", "access_token"];
exports.logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.Console()],
    exitOnError: false,
});
function add_mongo_transport() {
    const transportOptions = {
        db: process.env.DB_URL || "",
        level: "error",
        collection: "Logs",
        capped: true,
        cappedMax: 1000,
        format: winston_1.default.format.json(),
    };
    exports.logger.add(new winston_mongodb_1.MongoDB(transportOptions));
}
