import {
	AchievementsTC,
	AvatarsTC,
	BadgesTC,
	FiguresTC,
	SkinsTC,
	TitlesTC,
} from "@modules/items";
import { WorkoutsTC } from "@modules/workouts";
import { schemaComposer } from "graphql-compose";
import { ItemCategory, ItemCategoryTc } from "types/collections";
import { JourneyModel } from "./journey.schema";
import { JourneyTC } from "./journey.tc";

JourneyTC.addRelation("workouts", {
	resolver: () => WorkoutsTC.getResolver("findMany"),
	prepareArgs: {
		filter: (source) => ({ _id: { $in: source.workouts } }),
	},
	projection: { workouts: true }, // Provide the field to be projected
});

const ItemUnionTC = schemaComposer.createUnionTC({
	name: "ItemUnion",
	types: [TitlesTC, AchievementsTC, BadgesTC, AvatarsTC, SkinsTC, FiguresTC],
	resolveType: (value: any) => {
		const mapped = ItemCategoryTc[value.category as ItemCategory];

		if (!mapped) throw new Error(`Unknown item type: ${value.category}`);
		return mapped;
	},
});

const InventoryItemTC = schemaComposer.createObjectTC({
	name: "InventoryItem",
	fields: {
		item: ItemUnionTC.getType(), // ✅ discriminator support here
		owned_at: "Date!",
	},
});

JourneyTC.addFields({
	inventory: {
		type: "[InventoryItem!]!",
		resolve: async (source, args) => {
			const populated = await JourneyModel.populate(source, {
				path: "inventory.item",
			});

			let items = (populated.inventory || []) as Array<{
				item: any;
				owned_at: Date;
			}>;

			const { filter } = args;

			if (!!filter) {
				if (filter.category) {
					items = items.filter(
						(item) => item.item.category === filter.category
					);
				}

				if (filter.search) {
					const searchRegex = new RegExp(filter.search, "i");
					items = items.filter((item) =>
						"name" in item.item ? searchRegex.test(item.item.name) : false
					);
				}
			}

			return items;
		},
		projection: { inventory: true },
		args: {
			filter: schemaComposer.createInputTC({
				name: "InventoryItemFilter",
				fields: {
					category: "String",
					search: "String",
				},
			}),
		},
	},
});
