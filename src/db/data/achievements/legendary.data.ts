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

const LegendaryAchievements: TAchievement[] = [
	{
		key: AchievementKeys.sudo,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.sudo]),
		description: AchievementDescriptionByKey[AchievementKeys.sudo],
		rarity: AchievementRarityByKey[AchievementKeys.sudo],
		name: AchievementNameByKey[AchievementKeys.sudo],
	},
	{
		key: AchievementKeys.a_hundred,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.a_hundred]),
		description: AchievementDescriptionByKey[AchievementKeys.a_hundred],
		rarity: AchievementRarityByKey[AchievementKeys.a_hundred],
		name: AchievementNameByKey[AchievementKeys.a_hundred],
	},
	{
		key: AchievementKeys.rich,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.rich]),
		description: AchievementDescriptionByKey[AchievementKeys.rich],
		rarity: AchievementRarityByKey[AchievementKeys.rich],
		name: AchievementNameByKey[AchievementKeys.rich],
	},
	{
		key: AchievementKeys.mentor,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.mentor]),
		description: AchievementDescriptionByKey[AchievementKeys.mentor],
		rarity: AchievementRarityByKey[AchievementKeys.mentor],
		name: AchievementNameByKey[AchievementKeys.mentor],
	},
];

export default LegendaryAchievements;
