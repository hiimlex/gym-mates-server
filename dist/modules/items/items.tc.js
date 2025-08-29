"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgesTC = exports.SkinsTC = exports.AvatarsTC = exports.TitlesTC = exports.ItemsQueries = exports.ItemsMutations = exports.ItemsDTC = exports.FiguresTC = exports.AchievementsTC = void 0;
const graphql_compose_mongoose_1 = require("graphql-compose-mongoose");
const items_schema_1 = require("./items.schema");
const collections_1 = require("../../types/collections");
const ItemsDTC = (0, graphql_compose_mongoose_1.composeWithMongooseDiscriminators)(items_schema_1.ItemsModel);
exports.ItemsDTC = ItemsDTC;
const TitlesTC = ItemsDTC.discriminator(items_schema_1.TitlesModel, {
    fields: {
        remove: ["name"],
    },
    name: collections_1.ItemCategoryTc[collections_1.ItemCategory.Title],
});
exports.TitlesTC = TitlesTC;
const AvatarsTC = ItemsDTC.discriminator(items_schema_1.AvatarsModel, {
    name: collections_1.ItemCategoryTc[collections_1.ItemCategory.Avatar],
});
exports.AvatarsTC = AvatarsTC;
const SkinsTC = ItemsDTC.discriminator(items_schema_1.SkinsModel, {
    name: collections_1.ItemCategoryTc[collections_1.ItemCategory.Skin],
});
exports.SkinsTC = SkinsTC;
const BadgesTC = ItemsDTC.discriminator(items_schema_1.BadgesModel, {
    name: collections_1.ItemCategoryTc[collections_1.ItemCategory.Badge],
});
exports.BadgesTC = BadgesTC;
const AchievementsTC = ItemsDTC.discriminator(items_schema_1.AchievementsModel, {
    name: collections_1.ItemCategoryTc[collections_1.ItemCategory.Achievement],
});
exports.AchievementsTC = AchievementsTC;
const FiguresTC = ItemsDTC.discriminator(items_schema_1.FiguresModel, {
    name: collections_1.ItemCategoryTc[collections_1.ItemCategory.Figure],
});
exports.FiguresTC = FiguresTC;
const ItemsQueries = {};
exports.ItemsQueries = ItemsQueries;
const ItemsMutations = {};
exports.ItemsMutations = ItemsMutations;
