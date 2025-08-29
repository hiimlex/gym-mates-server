"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyModel = exports.EventSchema = exports.JourneySchema = void 0;
const schema_config_1 = require("../../config/schema.config");
const mongoose_1 = require("mongoose");
const collections_1 = require("../../types/collections");
const EventSchema = new mongoose_1.Schema({
    action: {
        type: String,
        required: true,
        enum: Object.values(collections_1.JourneyEventAction),
    },
    schema: {
        type: String,
        required: true,
        enum: Object.values(collections_1.JourneyEventSchemaType),
    },
    data: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
}, { versionKey: false, timestamps: schema_config_1.timestamps });
exports.EventSchema = EventSchema;
const InventoryItem = new mongoose_1.Schema({
    item: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: collections_1.Collections.Items,
        required: true,
    },
    owned_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
}, { _id: false, versionKey: false, timestamps: false });
const JourneySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: collections_1.Collections.Users,
        required: true,
        unique: true,
    },
    events: {
        type: [EventSchema],
        required: true,
        default: [],
    },
    workouts: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: collections_1.Collections.Workouts,
        default: [],
        required: true,
    },
    inventory: {
        type: [InventoryItem],
        required: true,
        default: [],
    },
}, { versionKey: false, timestamps: schema_config_1.timestamps, collection: collections_1.Collections.Journeys });
exports.JourneySchema = JourneySchema;
const JourneyModel = (0, mongoose_1.model)(collections_1.Collections.Journeys, JourneySchema, collections_1.Collections.Journeys);
exports.JourneyModel = JourneyModel;
