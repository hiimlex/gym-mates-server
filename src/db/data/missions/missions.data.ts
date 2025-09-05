import { Types } from "mongoose";
import {
	AchievementDescriptionByKey,
	AchievementIdsByKey,
	AchievementKeys,
	AchievementNameByKey,
	MissionContext,
	MissionsIdsByAchievementKey,
	TMission,
} from "types/collections";

const WorkoutsMissions: TMission[] = [
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.first_workout]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.first_workout]
		),
		requirements: [],
		reward: 5,
		name: AchievementNameByKey[AchievementKeys.first_workout],
		description: AchievementDescriptionByKey[AchievementKeys.first_workout],
		hidden: false,
		context: MissionContext.Workout,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.speed_runner]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.speed_runner]
		),
		requirements: [AchievementKeys.first_workout],
		reward: 2,
		name: AchievementNameByKey[AchievementKeys.speed_runner],
		description: AchievementDescriptionByKey[AchievementKeys.speed_runner],
		hidden: true,
		context: MissionContext.Workout,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.tik_tok]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.tik_tok]
		),
		requirements: [AchievementKeys.speed_runner],
		reward: 3,
		name: AchievementNameByKey[AchievementKeys.tik_tok],
		description: AchievementDescriptionByKey[AchievementKeys.tik_tok],
		hidden: true,
		context: MissionContext.Workout,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.one_week_streak]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.one_week_streak]
		),
		requirements: [AchievementKeys.first_workout],
		reward: 7,
		name: AchievementNameByKey[AchievementKeys.one_week_streak],
		description: AchievementDescriptionByKey[AchievementKeys.one_week_streak],
		hidden: false,
		context: MissionContext.Workout,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.one_month_streak]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.one_month_streak]
		),
		requirements: [AchievementKeys.one_week_streak],
		reward: 15,
		name: AchievementNameByKey[AchievementKeys.one_month_streak],
		description: AchievementDescriptionByKey[AchievementKeys.one_month_streak],
		context: MissionContext.Workout,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.weekend_warrior]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.weekend_warrior]
		),
		requirements: [AchievementKeys.first_workout],
		reward: 5,
		name: AchievementNameByKey[AchievementKeys.weekend_warrior],
		description: AchievementDescriptionByKey[AchievementKeys.weekend_warrior],
		hidden: true,
		context: MissionContext.Workout,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.early_bird]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.early_bird]
		),
		requirements: [AchievementKeys.first_workout],
		reward: 5,
		name: AchievementNameByKey[AchievementKeys.early_bird],
		description: AchievementDescriptionByKey[AchievementKeys.early_bird],
		hidden: true,
		context: MissionContext.Workout,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.night_owl]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.night_owl]
		),
		requirements: [AchievementKeys.first_workout, AchievementKeys.early_bird],
		reward: 5,
		name: AchievementNameByKey[AchievementKeys.night_owl],
		description: AchievementDescriptionByKey[AchievementKeys.night_owl],
		hidden: true,
		context: MissionContext.Workout,
	},
];

const ShopMissions: TMission[] = [
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.consumerist]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.consumerist]
		),
		requirements: [],
		reward: 10,
		name: AchievementNameByKey[AchievementKeys.consumerist],
		description: AchievementDescriptionByKey[AchievementKeys.consumerist],
		hidden: false,
		context: MissionContext.Shop,
	},
	{
		_id: new Types.ObjectId(MissionsIdsByAchievementKey[AchievementKeys.poor]),
		achievement: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.poor]),
		requirements: [],
		reward: 10,
		name: AchievementNameByKey[AchievementKeys.poor],
		description: AchievementDescriptionByKey[AchievementKeys.poor],
		hidden: true,
		context: MissionContext.Shop,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.collector]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.collector]
		),
		requirements: [AchievementKeys.consumerist],
		reward: 15,
		name: AchievementNameByKey[AchievementKeys.collector],
		description: AchievementDescriptionByKey[AchievementKeys.collector],
		hidden: false,
		context: MissionContext.Shop,
	},
	{
		_id: new Types.ObjectId(MissionsIdsByAchievementKey[AchievementKeys.rich]),
		achievement: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.rich]),
		requirements: [AchievementKeys.collector, AchievementKeys.poor],
		reward: 25,
		name: AchievementNameByKey[AchievementKeys.rich],
		description: AchievementDescriptionByKey[AchievementKeys.rich],
		hidden: true,
		context: MissionContext.Shop,
	},
];

const SocialMissions: TMission[] = [
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.hello_world]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.hello_world]
		),
		requirements: [],
		reward: 5,
		name: AchievementNameByKey[AchievementKeys.hello_world],
		description: AchievementDescriptionByKey[AchievementKeys.hello_world],
		hidden: false,
		context: MissionContext.Social,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.family]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.family]
		),
		requirements: [AchievementKeys.hello_world],
		reward: 10,
		name: AchievementNameByKey[AchievementKeys.family],
		description: AchievementDescriptionByKey[AchievementKeys.family],
		hidden: false,
		context: MissionContext.Social,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.mentor]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.mentor]
		),
		requirements: [AchievementKeys.beta],
		reward: 20,
		name: AchievementNameByKey[AchievementKeys.mentor],
		description: AchievementDescriptionByKey[AchievementKeys.mentor],
		hidden: true,
		context: MissionContext.Social,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.influencer]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.influencer]
		),
		requirements: [],
		reward: 15,
		name: AchievementNameByKey[AchievementKeys.influencer],
		description: AchievementDescriptionByKey[AchievementKeys.influencer],
		hidden: false,
		context: MissionContext.Social,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.the_boss]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.the_boss]
		),
		requirements: [AchievementKeys.family, AchievementKeys.factotum],
		reward: 50,
		name: AchievementNameByKey[AchievementKeys.the_boss],
		description: AchievementDescriptionByKey[AchievementKeys.the_boss],
		hidden: true,
		context: MissionContext.Social,
	},
];

const SecretMissions: TMission[] = [
	{
		_id: new Types.ObjectId(MissionsIdsByAchievementKey[AchievementKeys.click]),
		achievement: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.click]),
		requirements: [],
		reward: 10,
		name: AchievementNameByKey[AchievementKeys.click],
		description: AchievementDescriptionByKey[AchievementKeys.click],
		hidden: true,
		context: MissionContext.Secret,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.unknown]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.unknown]
		),
		requirements: [AchievementKeys.click],
		reward: 20,
		name: AchievementNameByKey[AchievementKeys.unknown],
		description: AchievementDescriptionByKey[AchievementKeys.unknown],
		hidden: true,
		context: MissionContext.Secret,
	},
];

const Missions: TMission[] = [
	// Workouts
	...WorkoutsMissions,
	// Shop
	...ShopMissions,
	// Social
	...SocialMissions,
	// Secret
	...SecretMissions,
	// Dev
	// No missions for dev achievements
];

const MissionsIds = Missions.map((mission) => mission._id.toString());

export { Missions, MissionsIds };
