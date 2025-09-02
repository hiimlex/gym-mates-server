import { Types } from "mongoose";
import {
	AchievementDescriptionByKey,
	AchievementIdsByKey,
	AchievementKeys,
	AchievementNameByKey,
	AchievementRarityByKey,
	ItemCategory,
	TAchievement,
} from "types/collections";

const EpicAchievements: TAchievement[] = [
	{
		key: AchievementKeys.beta,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.beta]),
		description: AchievementDescriptionByKey[AchievementKeys.beta],
		rarity: AchievementRarityByKey[AchievementKeys.beta],
		name: AchievementNameByKey[AchievementKeys.beta],
	},
	{
		key: AchievementKeys.the_boss,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.the_boss]),
		description: AchievementDescriptionByKey[AchievementKeys.the_boss],
		rarity: AchievementRarityByKey[AchievementKeys.the_boss],
		name: AchievementNameByKey[AchievementKeys.the_boss],
	},
	{
		key: AchievementKeys.influencer,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.influencer]),
		description: AchievementDescriptionByKey[AchievementKeys.influencer],
		rarity: AchievementRarityByKey[AchievementKeys.influencer],
		name: AchievementNameByKey[AchievementKeys.influencer],
	},
	{
		key: AchievementKeys.collector,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.collector]),
		description: AchievementDescriptionByKey[AchievementKeys.collector],
		rarity: AchievementRarityByKey[AchievementKeys.collector],
		name: AchievementNameByKey[AchievementKeys.collector],
	},
	{
		key: AchievementKeys.unknown,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.unknown]),
		description: AchievementDescriptionByKey[AchievementKeys.unknown],
		rarity: AchievementRarityByKey[AchievementKeys.unknown],
		name: AchievementNameByKey[AchievementKeys.unknown],
	},
	{
		key: AchievementKeys.factotum,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.factotum]),
		description: AchievementDescriptionByKey[AchievementKeys.factotum],
		rarity: AchievementRarityByKey[AchievementKeys.factotum],
		name: AchievementNameByKey[AchievementKeys.factotum],
	},
];

export default EpicAchievements;
