"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthyModel = exports.HealthySchema = void 0;
const mongoose_1 = require("mongoose");
const collections_1 = require("../../types/collections");
const HealthySchema = new mongoose_1.Schema({
    weight: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    body_fat: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: collections_1.Collections.Users,
        required: true,
        unique: true,
    }
}, { versionKey: false, timestamps: true, collection: collections_1.Collections.HealthyInfo });
exports.HealthySchema = HealthySchema;
const HealthyModel = (0, mongoose_1.model)(collections_1.Collections.HealthyInfo, HealthySchema, collections_1.Collections.HealthyInfo);
exports.HealthyModel = HealthyModel;
