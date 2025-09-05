import { MissionSchema } from "@modules/missions";
import { Document, InferSchemaType, Types } from "mongoose";
import { IBusEventPayloadData } from "types/generics";
import { AchievementKeys, WorkoutAchievementKeys } from "./achievements.model";
import { IUserDocument } from "./users.model";
import { IJourneyDocument } from "./journey.model";

export type TMission = InferSchemaType<typeof MissionSchema> & {
	_id: Types.ObjectId;
};

export interface IMissionDocument extends TMission, Document<Types.ObjectId> {}

export const MissionsIdsByAchievementKey: Record<AchievementKeys, string> = {
	// don't have mission for it
	"achievement:sudo": "68b6ee136797cdaeb3fa78dd",
	"achievement:beta": "68b6ee1722196df1889649f3",
	// workout missions
	"achievement:first_workout": "68b6ee2073028600cca231d3",
	"achievement:speed_runner": "68b6ee241a273b56290f0c58",
	"achievement:tik_tok": "68b6ee29aded24aa9e13de97",
	"achievement:one_week_streak": "68b6ee2d910a87575324b253",
	"achievement:one_month_streak": "68b6ee32160acc29116f7019",
	"achievement:weekend_warrior": "68b6ee379b3f15c55dde4c45",
	"achievement:early_bird": "68b6ee3bd10092ef67eb4e05",
	"achievement:night_owl": "68b6ee3f5e72796740586abb",
	"achievement:factotum": "68b6ee714265315695a90075",
	"achievement:a_hundred": "68b6ee44a3d02527f448221f",
	// social missions
	"achievement:hello_world": "68b6f0f03fdfb7c34018d3f6",
	"achievement:the_boss": "68b6ee1b1a9937422ebf963c",
	"achievement:mentor": "68b6ee64cbed5c082118a933",
	"achievement:influencer": "68b6ee68246a70017156034a",
	"achievement:family": "68b6ee6c379d2443caa31d09",
	// shop missions
	"achievement:rich": "68b6ee49888b997a87b03184",
	"achievement:collector": "68b6ee4d2648e708139a7398",
	"achievement:consumerist": "68b6ee5b26a4e76ef0e6a873",
	"achievement:poor": "68b6ee5f58b407ddb985d7cc",
	// secret
	"achievement:click": "68b6ee52fd696df6a825a1fa",
	"achievement:unknown": "68b6ee56a76e28585ea2b8ba",
};

export enum MissionContext {
	Workout = "workout",
	Social = "social",
	Shop = "shop",
	Secret = "secret",
}

export abstract class BaseCheckFunctions {
	user!: IUserDocument;
	journey!: IJourneyDocument;
}

export type IMissionCheckFunctionResult = Promise<{
	completed: boolean;
}>;

export type IMissionCheckFunction = (
	payload: IBusEventPayloadData
) => IMissionCheckFunctionResult;

export interface IWorkoutMissionsCheckFunctions {
	by_achievement_key: Record<WorkoutAchievementKeys, IMissionCheckFunction>;
	check_first_workout: IMissionCheckFunction;
	check_night_owl: IMissionCheckFunction;
	check_early_bird: IMissionCheckFunction;
	check_weekend_warrior: IMissionCheckFunction;
	check_one_week_streak: IMissionCheckFunction;
	check_one_month_streak: IMissionCheckFunction;
	check_speed_runner: IMissionCheckFunction;
	check_tik_tok: IMissionCheckFunction;
	check_factotum: IMissionCheckFunction;
	check_a_hundred: IMissionCheckFunction;
}

export interface ISocialMissionsCheckFunctions {
	check_hello_world: IMissionCheckFunction;
	check_the_boss: IMissionCheckFunction;
	check_mentor: IMissionCheckFunction;
	check_influencer: IMissionCheckFunction;
	check_family: IMissionCheckFunction;
}

export interface IShopMissionsCheckFunctions {
	check_rich: IMissionCheckFunction;
	check_collector: IMissionCheckFunction;
	check_consumerist: IMissionCheckFunction;
	check_poor: IMissionCheckFunction;
}

export interface ISecretMissionsCheckFunctions {
	check_click: IMissionCheckFunction;
	check_unknown: IMissionCheckFunction;
}
