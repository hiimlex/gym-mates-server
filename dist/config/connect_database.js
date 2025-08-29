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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect_database = connect_database;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_config_1 = require("./logger.config");
function connect_database() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (mongoose_1.default.connection.readyState !== 0) {
                throw new Error("Database is already connected");
            }
            const instance = yield mongoose_1.default.connect(process.env.DB_URL || "");
            (0, logger_config_1.add_mongo_transport)();
            return instance;
        }
        catch (error) {
            console.error("Error connecting to database: ", error);
            return null;
        }
    });
}
