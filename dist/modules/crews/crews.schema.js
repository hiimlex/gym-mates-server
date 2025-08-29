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
exports.MemberSchema = exports.CrewsSchema = exports.CrewsModel = exports.CrewRulesSchema = void 0;
const schema_config_1 = require("../../config/schema.config");
const files_1 = require("../files");
const mongoose_1 = require("mongoose");
const collections_1 = require("../../types/collections");
const CrewRulesSchema = new mongoose_1.Schema({
    gym_focused: { type: Boolean, default: false, required: false },
    pay_on_past: { type: Boolean, default: true, required: false },
    pay_without_picture: { type: Boolean, default: true, required: false },
    show_members_rank: { type: Boolean, default: true, required: false },
    free_weekends: { type: Boolean, default: true, required: false },
}, { versionKey: false, _id: false });
exports.CrewRulesSchema = CrewRulesSchema;
const MemberSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: collections_1.Collections.Users,
        required: true,
    },
    is_admin: {
        type: Boolean,
        default: false,
        required: false,
    },
    joined_at: {
        type: Date,
        default: Date.now,
        required: false,
    },
}, { versionKey: false });
exports.MemberSchema = MemberSchema;
const CrewsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    members: {
        type: [MemberSchema],
        required: true,
        default: [],
    },
    white_list: {
        type: [mongoose_1.Types.ObjectId],
        ref: collections_1.Collections.Users,
        default: [],
    },
    created_by: {
        type: mongoose_1.Types.ObjectId,
        ref: collections_1.Collections.Users,
        required: true,
        unique: true,
    },
    visibility: {
        type: String,
        enum: Object.values(collections_1.CrewVisibility),
        default: collections_1.CrewVisibility.Public,
    },
    banner: {
        type: files_1.FileSchema,
        required: false,
    },
    rules: {
        type: CrewRulesSchema,
        required: false,
        default: {
            gym_focused: false,
            paid_at_anytime: true,
            paid_without_picture: true,
            show_members_rank: true,
            free_weekends: true,
        },
    },
    streak: {
        type: [String],
        enum: Object.values(collections_1.CrewStreak),
        default: [collections_1.CrewStreak.Weekly, collections_1.CrewStreak.Monthly],
    },
    lose_streak_in_days: {
        type: Number,
        default: 2,
        required: false,
    },
}, { versionKey: false, timestamps: schema_config_1.timestamps });
exports.CrewsSchema = CrewsSchema;
CrewsSchema.methods.populate_members = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.populate({
            path: "members",
            select: "name email avatar coins",
        });
    });
};
const CrewsModel = (0, mongoose_1.model)(collections_1.Collections.Crews, CrewsSchema, collections_1.Collections.Crews);
exports.CrewsModel = CrewsModel;
