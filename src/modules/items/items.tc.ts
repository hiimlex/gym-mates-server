import { composeWithMongooseDiscriminators } from "graphql-compose-mongoose";
import {
	AchievementsModel,
	AvatarsModel,
	BadgesModel,
	FiguresModel,
	ItemsModel,
	SkinsModel,
	TitlesModel,
} from "./items.schema";
import { ItemCategory, ItemCategoryTc } from "types/collections";

const ItemsDTC = composeWithMongooseDiscriminators(ItemsModel);

const TitlesTC = ItemsDTC.discriminator(TitlesModel, {
	fields: {
		remove: ["name"],
	},
	name: ItemCategoryTc[ItemCategory.Title],
});
const AvatarsTC = ItemsDTC.discriminator(AvatarsModel, {
	name: ItemCategoryTc[ItemCategory.Avatar],
});
const SkinsTC = ItemsDTC.discriminator(SkinsModel, {
	name: ItemCategoryTc[ItemCategory.Skin],
});
const BadgesTC = ItemsDTC.discriminator(BadgesModel, {
	name: ItemCategoryTc[ItemCategory.Badge],
});
const AchievementsTC = ItemsDTC.discriminator(AchievementsModel, {
	name: ItemCategoryTc[ItemCategory.Achievement],
});
const FiguresTC = ItemsDTC.discriminator(FiguresModel, {
	name: ItemCategoryTc[ItemCategory.Figure],
});

const ItemsQueries = {};

const ItemsMutations = {};

export {
	AchievementsTC,
	FiguresTC,
	ItemsDTC,
	ItemsMutations,
	ItemsQueries,
	TitlesTC,
	AvatarsTC,
	SkinsTC,
	BadgesTC,
};
