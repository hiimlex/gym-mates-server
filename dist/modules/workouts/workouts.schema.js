"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutsModel = exports.WorkoutSchema = void 0;
const schema_config_1 = require("../../config/schema.config");
const files_1 = require("../files");
const mongoose_1 = require("mongoose");
const collections_1 = require("../../types/collections");
const WorkoutSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: collections_1.Collections.Users,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    picture: {
        type: files_1.FileSchema,
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(collections_1.WorkoutType),
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    shared_to: {
        type: [mongoose_1.Types.ObjectId],
        ref: collections_1.Collections.Crews,
        required: true,
    },
    earned: {
        type: Number,
        default: 0,
        required: false,
    },
    receipt: {
        type: Map,
        of: Number,
        default: {},
        required: false,
    },
}, { versionKey: false, timestamps: schema_config_1.timestamps, collection: collections_1.Collections.Workouts });
exports.WorkoutSchema = WorkoutSchema;
const WorkoutsModel = (0, mongoose_1.model)(collections_1.Collections.Workouts, WorkoutSchema, collections_1.Collections.Workouts);
exports.WorkoutsModel = WorkoutsModel;
