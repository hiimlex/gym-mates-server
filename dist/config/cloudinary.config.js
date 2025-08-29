"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.cloudinaryDestroy = void 0;
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.cloudinaryDestroy = cloudinary.uploader.destroy;
exports.storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "gym-mates",
        allowedFormats: ["jpg", "png", "jpeg", "svg", "gif"],
    },
});
