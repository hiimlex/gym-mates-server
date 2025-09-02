import { Types } from "mongoose";
import { ItemCategory, TItem } from "./items.model";

export type TAchievement = Omit<TItem, "price" | "requirements"> & {
	_id: Types.ObjectId;
	key: AchievementKeys;
	rarity: AchievementRarity;
	description: string;
	category: ItemCategory;
};

export enum AchievementKeys {
	// dev
	sudo = "achievement:sudo",
	beta = "achievement:beta",
	// workouts
	first_workout = "achievement:first_workout",
	speedrunner = "achievement:speedrunner",
	maraton = "achievement:maraton",
	one_week_streak = "achievement:one_week_streak",
	one_month_streak = "achievement:one_month_streak",
	weekend_warrior = "achievement:weekend_warrior",
	early_bird = "achievement:early_bird",
	night_owl = "achievement:night_owl",
	factotum = "achievement:factotum",
	a_hundred = "achievement:a_hundred",
	// shop
	collector = "achievement:collector",
	consumerist = "achievement:consumerist",
	rich = "achievement:rich",
	poor = "achievement:poor",
	// social
	hello_world = "achievement:hello_world",
	influencer = "achievement:influencer",
	family = "achievement:family",
	the_boss = "achievement:the_boss",
	mentor = "achievement:mentor",
	// secret
	click = "achievement:click",
	unknown = "achievement:unknown",
}

export enum AchievementRarity {
	common = "common",
	rare = "rare",
	epic = "epic",
	legendary = "legendary",
}

export const AchievementNameByKey: Record<AchievementKeys, string> = {
	// dev
	"achievement:sudo": "Sudo",
	"achievement:beta": "Beta Tester",
	"achievement:mentor": "Mentor",
	// workouts
	"achievement:first_workout": "First Workout",
	"achievement:speedrunner": "Speedrunner",
	"achievement:maraton": "Maraton",
	"achievement:one_week_streak": "One Week Streak",
	"achievement:one_month_streak": "One Month Streak",
	"achievement:weekend_warrior": "Weekend Warrior",
	"achievement:early_bird": "Early Bird",
	"achievement:night_owl": "Night Owl",
	"achievement:a_hundred": "A Hundred",
	"achievement:factotum": "Factotum",
	// shop
	"achievement:collector": "Collector",
	"achievement:consumerist": "Consumerist",
	"achievement:rich": "Rich",
	"achievement:poor": "Poor",
	// social
	"achievement:hello_world": "Hello World",
	"achievement:influencer": "Influencer",
	"achievement:family": "Family",
	"achievement:the_boss": "The Boss",
	// secret
	"achievement:click": "Click",
	"achievement:unknown": "Unknown",
};

export const AchievementDescriptionByKey: Record<AchievementKeys, string> = {
	// dev
	"achievement:sudo": "Have developer privileges (only for developers)",
	// Beta
	"achievement:beta": "Be a beta tester (only for beta testers)",
	"achievement:mentor": "5 new users joined using your invite code",
	//
	"achievement:first_workout": "Complete your first workout",
	"achievement:speedrunner": "Complete a workout in under 15 minutes",
	"achievement:maraton": "Complete a workout with more than 3 hours",
	"achievement:one_week_streak":
		"Complete at least one workout every day for a week",
	"achievement:one_month_streak":
		"Complete at least one workout every day for a month",
	"achievement:weekend_warrior":
		"Complete at least one workout on both Saturday and Sunday in the same weekend",
	"achievement:early_bird": "Complete a workout before 8 AM",
	"achievement:night_owl": "Complete a workout after 10 PM",
	"achievement:a_hundred": "Reach a total of 100 workouts completed",
	"achievement:rich": "Accumulate a total of 1000 coins",
	"achievement:collector": "Own at least 10 different items",
	"achievement:click": "Click the hidden button in the app 100 times",
	"achievement:unknown": "Discover a hidden feature in the app",
	"achievement:consumerist": "Purchase at least 5 items from the store",
	"achievement:poor": "Spend all your coins and have 0 left",
	"achievement:influencer": "Reach 100 followers",
	"achievement:family": "Be in a crew with 10 members",
	"achievement:factotum": "Do all workouts type",
	"achievement:the_boss":
		"Be the rank number one for a month (needs to have at least 5 active users in crew)",
	"achievement:hello_world": "Join a crew",
};

export const AchievementRarityByKey: Record<
	AchievementKeys,
	AchievementRarity
> = {
	"achievement:sudo": AchievementRarity.legendary,
	"achievement:beta": AchievementRarity.epic,
	"achievement:the_boss": AchievementRarity.epic,
	"achievement:first_workout": AchievementRarity.common,
	"achievement:speedrunner": AchievementRarity.rare,
	"achievement:maraton": AchievementRarity.rare,
	"achievement:one_week_streak": AchievementRarity.common,
	"achievement:one_month_streak": AchievementRarity.rare,
	"achievement:weekend_warrior": AchievementRarity.common,
	"achievement:early_bird": AchievementRarity.rare,
	"achievement:night_owl": AchievementRarity.rare,
	"achievement:a_hundred": AchievementRarity.legendary,
	"achievement:rich": AchievementRarity.legendary,
	"achievement:collector": AchievementRarity.epic,
	"achievement:click": AchievementRarity.common,
	"achievement:unknown": AchievementRarity.epic,
	"achievement:consumerist": AchievementRarity.common,
	"achievement:poor": AchievementRarity.common,
	"achievement:mentor": AchievementRarity.legendary,
	"achievement:influencer": AchievementRarity.epic,
	"achievement:family": AchievementRarity.rare,
	"achievement:factotum": AchievementRarity.epic,
	"achievement:hello_world": AchievementRarity.common,
};

export const AchievementIdsByKey: Record<AchievementKeys, string> = {
	"achievement:sudo": "68b6da34cc35627d3100619f",
	"achievement:beta": "68b6dbbc2afe375afd84cfda",
	"achievement:the_boss": "68b6dbc1684a8551f5c3e58b",
	"achievement:first_workout": "68b6dbc5ac1272797c379287",
	"achievement:speedrunner": "68b6dbca6f8e09effd7267d8",
	"achievement:maraton": "68b6dbcf1fb30e78d0bef927",
	"achievement:one_week_streak": "68b6dbd47888615c6e1025d8",
	"achievement:one_month_streak": "68b6dbdb1ea8809063b62c00",
	"achievement:weekend_warrior": "68b6dbdf64b2af97f9e5be46",
	"achievement:early_bird": "68b6dbe560f40c34857a77b3",
	"achievement:night_owl": "68b6dbe97a56a34de71d615e",
	"achievement:a_hundred": "68b6dbef80b1c7c8327f9dde",
	"achievement:rich": "68b6dbf4aa03a96e57d597fc",
	"achievement:collector": "68b6dbf9b6908ba6175baf7c",
	"achievement:click": "68b6dbfec68f6221a78f6ae1",
	"achievement:unknown": "68b6dc030f5c01b4122d180a",
	"achievement:consumerist": "68b6dc0942e4dfbd4265dca0",
	"achievement:poor": "68b6dc0d109b894dd69f745d",
	"achievement:mentor": "68b6dc12bc7d113ecb8697ad",
	"achievement:influencer": "68b6dc17eb9654793742e1f8",
	"achievement:family": "68b6dc1c84f888c28f707c44",
	"achievement:factotum": "68b6dc2116976229564e967b",
	"achievement:hello_world": "68b6f0e27da1e9b12755d3d8",
};
