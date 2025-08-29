"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinsModel = exports.BadgesModel = exports.AvatarsModel = exports.AchievementsModel = exports.TitlesModel = exports.FiguresModel = exports.ItemsModel = exports.ItemSchema = void 0;
const schema_config_1 = require("../../config/schema.config");
const files_1 = require("../files");
const mongoose_1 = require("mongoose");
const collections_1 = require("../../types/collections");
const ItemSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        enum: Object.values(collections_1.ItemCategory),
        required: true,
    },
    price: { type: Number, default: 0, required: true },
    requirements: {
        type: [String],
        default: [],
        required: true,
    },
}, {
    timestamps: schema_config_1.timestamps,
    versionKey: false,
    collection: collections_1.Collections.Items,
    _id: true,
    discriminatorKey: "category",
});
exports.ItemSchema = ItemSchema;
const dKey = "category";
ItemSchema.set("discriminatorKey", dKey);
const ItemsModel = (0, mongoose_1.model)(collections_1.Collections.Items, ItemSchema, collections_1.Collections.Items);
exports.ItemsModel = ItemsModel;
const FiguresModel = ItemsModel.discriminator(collections_1.ItemCategory.Figure, new mongoose_1.Schema({
    file: files_1.FileSchema,
    preview: files_1.FileSchema,
}, {
    versionKey: false,
}));
exports.FiguresModel = FiguresModel;
const BadgesModel = ItemsModel.discriminator(collections_1.ItemCategory.Badge, new mongoose_1.Schema({
    file: files_1.FileSchema,
}, {
    versionKey: false,
}));
exports.BadgesModel = BadgesModel;
const AvatarsModel = ItemsModel.discriminator(collections_1.ItemCategory.Avatar, new mongoose_1.Schema({
    file: files_1.FileSchema,
}, {
    versionKey: false,
}));
exports.AvatarsModel = AvatarsModel;
const SkinsModel = ItemsModel.discriminator(collections_1.ItemCategory.Skin, new mongoose_1.Schema({
    file: files_1.FileSchema,
    preview: files_1.FileSchema,
}, {
    versionKey: false,
}));
exports.SkinsModel = SkinsModel;
const TitlesModel = ItemsModel.discriminator(collections_1.ItemCategory.Title, new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
}));
exports.TitlesModel = TitlesModel;
const AchievementsModel = ItemsModel.discriminator(collections_1.ItemCategory.Achievement, new mongoose_1.Schema({
    key: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}));
exports.AchievementsModel = AchievementsModel;
