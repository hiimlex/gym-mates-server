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
const items_1 = require("../items");
const workouts_1 = require("../workouts");
const graphql_compose_1 = require("graphql-compose");
const collections_1 = require("../../types/collections");
const journey_schema_1 = require("./journey.schema");
const journey_tc_1 = require("./journey.tc");
journey_tc_1.JourneyTC.addRelation("workouts", {
    resolver: () => workouts_1.WorkoutsTC.getResolver("findMany"),
    prepareArgs: {
        filter: (source) => ({ _id: { $in: source.workouts } }),
    },
    projection: { workouts: true }, // Provide the field to be projected
});
const ItemUnionTC = graphql_compose_1.schemaComposer.createUnionTC({
    name: "ItemUnion",
    types: [items_1.TitlesTC, items_1.AchievementsTC, items_1.BadgesTC, items_1.AvatarsTC, items_1.SkinsTC, items_1.FiguresTC],
    resolveType: (value) => {
        const mapped = collections_1.ItemCategoryTc[value.category];
        console.log("Resolving type for item with category:", value.category, "Mapped to:", mapped);
        if (!mapped)
            throw new Error(`Unknown item type: ${value.category}`);
        return mapped;
    },
});
const InventoryItemTC = graphql_compose_1.schemaComposer.createObjectTC({
    name: "InventoryItem",
    fields: {
        item: ItemUnionTC.getType(), // ✅ discriminator support here
        owned_at: "Date!",
    },
});
journey_tc_1.JourneyTC.addFields({
    inventory: {
        type: "[InventoryItem!]!",
        resolve: (source, args) => __awaiter(void 0, void 0, void 0, function* () {
            const populated = yield journey_schema_1.JourneyModel.populate(source, {
                path: "inventory.item",
            });
            console.log("Populated inventory:", populated.inventory);
            let items = (populated.inventory || []);
            const { filter } = args;
            if (!!filter) {
                if (filter.category) {
                    items = items.filter((item) => item.item.category === filter.category);
                }
                if (filter.search) {
                    const searchRegex = new RegExp(filter.search, "i");
                    items = items.filter((item) => "name" in item.item ? searchRegex.test(item.item.name) : false);
                }
            }
            return items;
        }),
        projection: { inventory: true },
        args: {
            filter: graphql_compose_1.schemaComposer.createInputTC({
                name: "InventoryItemFilter",
                fields: {
                    category: "String",
                    search: "String",
                },
            }),
        },
    },
});
