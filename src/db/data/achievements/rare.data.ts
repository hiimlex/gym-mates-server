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
		key: AchievementKeys.speed_runner,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.speed_runner]),
		description: AchievementDescriptionByKey[AchievementKeys.speed_runner],
		rarity: AchievementRarityByKey[AchievementKeys.speed_runner],
		name: AchievementNameByKey[AchievementKeys.speed_runner],
	},
	{
		key: AchievementKeys.tik_tok,
		category: ItemCategory.Achievement,
		_id: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.tik_tok]),
		description: AchievementDescriptionByKey[AchievementKeys.tik_tok],
		rarity: AchievementRarityByKey[AchievementKeys.tik_tok],
		name: AchievementNameByKey[AchievementKeys.tik_tok],
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
