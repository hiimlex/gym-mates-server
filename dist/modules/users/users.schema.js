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
exports.UsersSchema = exports.UsersModel = void 0;
const schema_config_1 = require("../../config/schema.config");
const http_exception_1 = require("../../core/http_exception");
const mongoose_1 = require("mongoose");
const collections_1 = require("../../types/collections");
const journey_1 = require("../journey");
const files_1 = require("../files");
const UsersSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    access_token: { type: String, required: false },
    avatar: { type: files_1.FileSchema, required: false },
    character: { type: String, required: false },
    coins: { type: Number, default: 0, required: true },
    title: {
        type: mongoose_1.Types.ObjectId,
        ref: collections_1.Collections.Items,
        required: false,
    },
    journey: {
        type: mongoose_1.Types.ObjectId,
        ref: collections_1.Collections.Journeys,
        required: false,
    },
    healthy: {
        type: mongoose_1.Types.ObjectId,
        red: collections_1.Collections.HealthyInfo,
        required: false,
    },
    following: {
        type: [mongoose_1.Types.ObjectId],
        ref: collections_1.Collections.Users,
        required: false,
    },
    followers: {
        type: [mongoose_1.Types.ObjectId],
        ref: collections_1.Collections.Users,
        required: false,
    },
    favorites: {
        type: [mongoose_1.Types.ObjectId],
        ref: collections_1.Collections.Crews,
        required: false,
    },
    day_streak: {
        type: Number,
        default: 0,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
}, { versionKey: false, timestamps: schema_config_1.timestamps, collection: collections_1.Collections.Users });
exports.UsersSchema = UsersSchema;
UsersSchema.methods.add_journey_event = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // Ensure the user has a journey
        if (!user.journey) {
            throw new http_exception_1.HttpException(404, "JOURNEY_NOT_FOUND");
        }
        const user_journey = yield journey_1.JourneyModel.findById(user.journey);
        if (!user_journey) {
            throw new http_exception_1.HttpException(404, "JOURNEY_NOT_FOUND");
        }
        yield user_journey.updateOne({
            $push: { events: event },
        });
    });
};
UsersSchema.methods.add_workout = function (workout_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // Ensure the user has a journey
        if (!user.journey) {
            throw new http_exception_1.HttpException(404, "JOURNEY_NOT_FOUND");
        }
        const user_journey = yield journey_1.JourneyModel.findById(user.journey);
        if (!user_journey) {
            throw new http_exception_1.HttpException(404, "JOURNEY_NOT_FOUND");
        }
        yield user_journey.updateOne({
            $push: { workouts: workout_id },
        });
    });
};
UsersSchema.methods.add_item_to_inventory = function (item_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // Ensure the user has a journey
        if (!user.journey) {
            throw new http_exception_1.HttpException(404, "JOURNEY_NOT_FOUND");
        }
        const user_journey = yield journey_1.JourneyModel.findById(user.journey);
        if (!user_journey) {
            throw new http_exception_1.HttpException(404, "JOURNEY_NOT_FOUND");
        }
        yield user_journey.updateOne({
            $push: { inventory: item_id },
        });
    });
};
UsersSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    // Remove the password field from the user object
    delete userObject.password;
    delete userObject.access_token;
    return userObject;
};
const UsersModel = (0, mongoose_1.model)(collections_1.Collections.Users, UsersSchema, collections_1.Collections.Users);
exports.UsersModel = UsersModel;
