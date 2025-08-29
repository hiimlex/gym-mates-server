"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSchema = void 0;
const schema_config_1 = require("../../config/schema.config");
const mongoose_1 = require("mongoose");
const FileSchema = new mongoose_1.Schema({
    url: String,
    public_id: {
        type: String,
    },
}, { versionKey: false, timestamps: schema_config_1.timestamps });
exports.FileSchema = FileSchema;
