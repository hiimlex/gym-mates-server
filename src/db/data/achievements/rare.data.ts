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

const RareAchievements: TAchievement[] = [
	{
		key: AchievementKeys.speedrunner,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.speedrunner]),
		description: AchievementDescriptionByKey[AchievementKeys.speedrunner],
		rarity: AchievementRarityByKey[AchievementKeys.speedrunner],
		name: AchievementNameByKey[AchievementKeys.speedrunner],
	},
	{
		key: AchievementKeys.maraton,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.maraton]),
		description: AchievementDescriptionByKey[AchievementKeys.maraton],
		rarity: AchievementRarityByKey[AchievementKeys.maraton],
		name: AchievementNameByKey[AchievementKeys.maraton],
	},
	{
		key: AchievementKeys.early_bird,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.early_bird]),
		description: AchievementDescriptionByKey[AchievementKeys.early_bird],
		rarity: AchievementRarityByKey[AchievementKeys.early_bird],
		name: AchievementNameByKey[AchievementKeys.early_bird],
	},
	{
		key: AchievementKeys.night_owl,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.night_owl]),
		description: AchievementDescriptionByKey[AchievementKeys.night_owl],
		rarity: AchievementRarityByKey[AchievementKeys.night_owl],
		name: AchievementNameByKey[AchievementKeys.night_owl],
	},
	{
		key: AchievementKeys.family,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.family]),
		description: AchievementDescriptionByKey[AchievementKeys.family],
		rarity: AchievementRarityByKey[AchievementKeys.family],
		name: AchievementNameByKey[AchievementKeys.family],
	},
	{
		key: AchievementKeys.one_month_streak,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.one_month_streak]
		),
		description: AchievementDescriptionByKey[AchievementKeys.one_month_streak],
		rarity: AchievementRarityByKey[AchievementKeys.one_month_streak],
		name: AchievementNameByKey[AchievementKeys.one_month_streak],
	},
];

export default RareAchievements;
