import { Types } from "mongoose";
import {
	AchievementDescriptionByKey,
	AchievementIdsByKey,
	AchievementKeys,
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
		name: "First Workout",
		description: AchievementDescriptionByKey[AchievementKeys.first_workout],
		hidden: false,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.speedrunner]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.speedrunner]
		),
		requirements: [AchievementKeys.first_workout],
		reward: 2,
		name: "Speedrunner",
		description: AchievementDescriptionByKey[AchievementKeys.speedrunner],
		hidden: true,
	},
	{
		_id: new Types.ObjectId(
			MissionsIdsByAchievementKey[AchievementKeys.maraton]
		),
		achievement: new Types.ObjectId(
			AchievementIdsByKey[AchievementKeys.maraton]
		),
		requirements: [AchievementKeys.speedrunner],
		reward: 3,
		name: "Maraton",
		description: AchievementDescriptionByKey[AchievementKeys.maraton],
		hidden: true,
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
		name: "One Week Streak",
		description: AchievementDescriptionByKey[AchievementKeys.one_week_streak],
		hidden: false,
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
		name: "One Month Streak",
		description: AchievementDescriptionByKey[AchievementKeys.one_month_streak],
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
		name: "Weekend Warrior",
		description: AchievementDescriptionByKey[AchievementKeys.weekend_warrior],
		hidden: true,
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
		name: "Early Bird",
		description: AchievementDescriptionByKey[AchievementKeys.early_bird],
		hidden: true,
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
		name: "Night Owl",
		description: AchievementDescriptionByKey[AchievementKeys.night_owl],
		hidden: true,
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
		name: "Consumerist",
		description: AchievementDescriptionByKey[AchievementKeys.consumerist],
		hidden: false,
	},
	{
		_id: new Types.ObjectId(MissionsIdsByAchievementKey[AchievementKeys.poor]),
		achievement: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.poor]),
		requirements: [],
		reward: 10,
		name: "Poor",
		description: AchievementDescriptionByKey[AchievementKeys.poor],
		hidden: true,
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
		name: "Collector",
		description: AchievementDescriptionByKey[AchievementKeys.collector],
		hidden: false,
	},
	{
		_id: new Types.ObjectId(MissionsIdsByAchievementKey[AchievementKeys.rich]),
		achievement: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.rich]),
		requirements: [AchievementKeys.collector, AchievementKeys.poor],
		reward: 25,
		name: "Rich",
		description: AchievementDescriptionByKey[AchievementKeys.rich],
		hidden: true,
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
		name: "Hello World",
		description: AchievementDescriptionByKey[AchievementKeys.hello_world],
		hidden: false,
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
		name: "Family",
		description: AchievementDescriptionByKey[AchievementKeys.family],
		hidden: false,
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
		name: "Mentor",
		description: AchievementDescriptionByKey[AchievementKeys.mentor],
		hidden: true,
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
		name: "Influencer",
		description: AchievementDescriptionByKey[AchievementKeys.influencer],
		hidden: false,
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
		name: "The Boss",
		description: AchievementDescriptionByKey[AchievementKeys.the_boss],
		hidden: true,
	},
];

const SecretMissions: TMission[] = [
	{
		_id: new Types.ObjectId(MissionsIdsByAchievementKey[AchievementKeys.click]),
		achievement: new Types.ObjectId(AchievementIdsByKey[AchievementKeys.click]),
		requirements: [],
		reward: 10,
		name: "Click",
		description: AchievementDescriptionByKey[AchievementKeys.click],
		hidden: true,
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
		name: "Unknown",
		description: AchievementDescriptionByKey[AchievementKeys.unknown],
		hidden: true,
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
