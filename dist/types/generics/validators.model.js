"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateBody = void 0;
const joi_1 = __importDefault(require("joi"));
const collections_1 = require("../collections");
const CreateWorkout = joi_1.default.object({
    title: joi_1.default.string().required(),
    date: joi_1.default.date().required(),
    type: joi_1.default.string()
        .valid(...Object.values(collections_1.WorkoutType))
        .required(),
    shared_to: joi_1.default.array().items(joi_1.default.string()).required(),
    duration: joi_1.default.number().required(),
});
const CreateCrew = joi_1.default.object({
    name: joi_1.default.string().required(),
    visibility: joi_1.default.string()
        .valid(...Object.values(collections_1.CrewVisibility))
        .required(),
    code: joi_1.default.string().trim().required(),
    rules: joi_1.default.object({
        gym_focused: joi_1.default.boolean().optional(),
        pay_on_past: joi_1.default.boolean().optional(),
        pay_without_picture: joi_1.default.boolean().optional(),
        show_members_rank: joi_1.default.boolean().optional(),
        free_weekends: joi_1.default.boolean().optional(),
    }).optional(),
    streak: joi_1.default.array()
        .items(joi_1.default.string().valid(...Object.values(collections_1.CrewStreak)))
        .optional(),
});
const SignUp = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
exports.ValidateBody = {
    CreateWorkout,
    CreateCrew,
    SignUp,
    File,
};
