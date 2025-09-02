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

const CommonAchievements: TAchievement[] = [
	{
		key: AchievementKeys.first_workout,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.first_workout]),
		description: AchievementDescriptionByKey[AchievementKeys.first_workout],
		rarity: AchievementRarityByKey[AchievementKeys.first_workout],
		name: AchievementNameByKey[AchievementKeys.first_workout],
	},
	{
		key: AchievementKeys.one_week_streak,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.one_week_streak]
		),
		description: AchievementDescriptionByKey[AchievementKeys.one_week_streak],
		rarity: AchievementRarityByKey[AchievementKeys.one_week_streak],
		name: AchievementNameByKey[AchievementKeys.one_week_streak],
	},
	{
		key: AchievementKeys.weekend_warrior,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.weekend_warrior]
		),
		description: AchievementDescriptionByKey[AchievementKeys.weekend_warrior],
		rarity: AchievementRarityByKey[AchievementKeys.weekend_warrior],
		name: AchievementNameByKey[AchievementKeys.weekend_warrior],
	},
	{
		key: AchievementKeys.click,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.click]),
		description: AchievementDescriptionByKey[AchievementKeys.click],
		rarity: AchievementRarityByKey[AchievementKeys.click],
		name: AchievementNameByKey[AchievementKeys.click],
	},
	{
		key: AchievementKeys.consumerist,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.consumerist]),
		description: AchievementDescriptionByKey[AchievementKeys.consumerist],
		rarity: AchievementRarityByKey[AchievementKeys.consumerist],
		name: AchievementNameByKey[AchievementKeys.consumerist],
	},
	{
		key: AchievementKeys.poor,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.poor]),
		description: AchievementDescriptionByKey[AchievementKeys.poor],
		rarity: AchievementRarityByKey[AchievementKeys.poor],
		name: AchievementNameByKey[AchievementKeys.poor],
	},
	{
		key: AchievementKeys.hello_world,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.hello_world]),
		description: AchievementDescriptionByKey[AchievementKeys.hello_world],
		rarity: AchievementRarityByKey[AchievementKeys.hello_world],
		name: AchievementNameByKey[AchievementKeys.hello_world],
	},
];

export default CommonAchievements;
