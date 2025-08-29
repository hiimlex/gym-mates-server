"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.upload_key = void 0;
const cloudinary_config_1 = require("../config/cloudinary.config");
const multer_1 = __importDefault(require("multer"));
exports.upload_key = "image";
exports.upload = (0, multer_1.default)({ storage: cloudinary_config_1.storage });
