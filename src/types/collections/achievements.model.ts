export enum AchievementKeys {
	// dev
	sudo = "achievement:sudo", 
	beta = "achievement:beta",
	// workouts
	first_workout = "achievement:first_workout",
	speedrunner = "achievement:speedrunner",
	one_week_streak = "achievement:one_week_streak",
	one_month_streak = "achievement:one_month_streak",
	weekend_warrior = "achievement:weekend_warrior",
	early_bird = "achievement:early_bird",
	night_owl = "achievement:night_owl",
	a_hundred = "achievement:a_hundred",
	// items
	collector = "achievement:collector",
	consumerist = "achievement:consumerist",
	// coins
	rich = "achievement:rich",
	poor = "achievement:poor",
	// followers
	influencer = "achievement:influencer",
	family = "achievement:family",
	factotum = "achievement:factotum",
	the_boss = "achievement:the_boss",
	mentor = "achievement:mentor",
	maraton = "achievement:maraton",
	// hidden
	click = "achievement:click",
	unknown = "achievement:unknown",
}

export enum AchievementRarity {
	common = "common",
	rare = "rare",
	epic = "epic",
	legendary = "legendary",
}

export const AchievementDescription: Record<AchievementKeys, string> = {
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
};

export const AchievementRarityByKey: Record<
	AchievementKeys,
	AchievementRarity
> = {
	"achievement:sudo": AchievementRarity.legendary,
	"achievement:beta": AchievementRarity.legendary,
	"achievement:the_boss": AchievementRarity.legendary,
	"achievement:first_workout": AchievementRarity.common,
	"achievement:speedrunner": AchievementRarity.rare,
	"achievement:maraton": AchievementRarity.epic,
	"achievement:one_week_streak": AchievementRarity.common,
	"achievement:one_month_streak": AchievementRarity.rare,
	"achievement:weekend_warrior": AchievementRarity.common,
	"achievement:early_bird": AchievementRarity.common,
	"achievement:night_owl": AchievementRarity.common,
	"achievement:a_hundred": AchievementRarity.rare,
	"achievement:rich": AchievementRarity.rare,
	"achievement:collector": AchievementRarity.epic,
	"achievement:click": AchievementRarity.common,
	"achievement:unknown": AchievementRarity.epic,
	"achievement:consumerist": AchievementRarity.common,
	"achievement:poor": AchievementRarity.common,
	"achievement:mentor": AchievementRarity.legendary,
	"achievement:influencer": AchievementRarity.rare,
	"achievement:family": AchievementRarity.rare,
	"achievement:factotum": AchievementRarity.epic,
};
