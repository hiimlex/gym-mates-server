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
exports.destroyCloudinaryFileOnError = void 0;
const cloudinary_config_1 = require("../config/cloudinary.config");
const destroyCloudinaryFileOnError = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const file = req.file;
        if (file) {
            yield (0, cloudinary_config_1.cloudinaryDestroy)(file.filename);
        }
    }
    if (req.files) {
        const files = req.files;
        for (const file of files) {
            yield (0, cloudinary_config_1.cloudinaryDestroy)(file.filename);
        }
    }
});
exports.destroyCloudinaryFileOnError = destroyCloudinaryFileOnError;
