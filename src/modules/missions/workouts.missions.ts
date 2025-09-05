// This file contains checks related to missions

import { HttpException } from "@core/http_exception";
import { WorkoutsModel } from "@modules/workouts";
import { Types } from "mongoose";
import {
	BaseCheckFunctions,
	IJourneyDocument,
	IMissionCheckFunction,
	IUserDocument,
	IWorkoutDocument,
	IWorkoutMissionsCheckFunctions,
	WorkoutAchievementKeys,
	WorkoutType,
} from "types/collections";

// such as checking available missions and completing missions
// check achievements.model.ts for descriptions of each achievement
const WorkoutMissionsConfig = {
	early_bird_hour: 8, // 8 AM
	night_owl_hour: 22, // 10 PM
	speed_runner_minutes: 20, // 20 minutes
	tik_tok_minutes: 180, // in minutes (3 hours)
	one_week_streak_days: 7, // 7 days
	one_month_streak_days: 30, // 30 days
};

export class WorkoutMissionsCheckFunctions
	extends BaseCheckFunctions
	implements IWorkoutMissionsCheckFunctions
{
	constructor(user: IUserDocument, journey: IJourneyDocument) {
		super();
		this.user = user;
		this.journey = journey;
	}

	check_first_workout: IMissionCheckFunction = async (payload) => {
		const { workout_id } = payload;

		if (workout_id && Types.ObjectId.isValid(new Types.ObjectId(workout_id))) {
			const workout = await WorkoutsModel.findById(workout_id);

			if (!workout) {
				return { completed: false };
			}

			const user_workouts_count = await WorkoutsModel.countDocuments({
				user: this.user._id.toString(),
			});

			if (user_workouts_count >= 1) {
				return {
					completed: true,
				};
			}
		}

		return {
			completed: false,
		};
	};
	check_early_bird: IMissionCheckFunction = async (payload) => {
		const { workout_id } = payload;

		if (workout_id && Types.ObjectId.isValid(workout_id)) {
			const workout = await WorkoutsModel.findById(workout_id);

			if (!workout) {
				return { completed: false };
			}

			const workout_date = new Date(workout.date);

			if (workout_date.getHours() <= WorkoutMissionsConfig.early_bird_hour) {
				return {
					completed: true,
				};
			}
		}

		return {
			completed: false,
		};
	};
	check_night_owl: IMissionCheckFunction = async (payload) => {
		const { workout_id } = payload;

		if (workout_id && Types.ObjectId.isValid(workout_id)) {
			const workout = await WorkoutsModel.findById(workout_id);

			if (!workout) {
				return { completed: false };
			}

			const workout_date = new Date(workout.date);

			if (workout_date.getHours() >= WorkoutMissionsConfig.night_owl_hour) {
				return {
					completed: true,
				};
			}
		}

		return {
			completed: false,
		};
	};
	check_tik_tok: IMissionCheckFunction = async (payload) => {
		const { workout_id } = payload;

		if (workout_id && Types.ObjectId.isValid(workout_id)) {
			const workout = await WorkoutsModel.findById(workout_id);

			if (!workout) {
				return { completed: false };
			}

			if (workout.duration > WorkoutMissionsConfig.tik_tok_minutes) {
				return {
					completed: true,
				};
			}
		}

		return {
			completed: false,
		};
	};
	check_one_month_streak: IMissionCheckFunction = async (payload) => {
		if (
			(this.user.day_streak || 0) >= WorkoutMissionsConfig.one_month_streak_days
		) {
			return {
				completed: true,
			};
		}

		return {
			completed: false,
		};
	};
	check_one_week_streak: IMissionCheckFunction = async (payload) => {
		if (
			(this.user.day_streak || 0) >= WorkoutMissionsConfig.one_week_streak_days
		) {
			return {
				completed: true,
			};
		}

		return {
			completed: false,
		};
	};
	check_speed_runner: IMissionCheckFunction = async (payload) => {
		const { workout_id } = payload;

		if (workout_id && Types.ObjectId.isValid(workout_id)) {
			const workout = await WorkoutsModel.findById(workout_id);

			if (!workout) {
				return { completed: false };
			}
			if (workout.duration <= WorkoutMissionsConfig.speed_runner_minutes) {
				return {
					completed: true,
				};
			}
		}

		return {
			completed: false,
		};
	};
	check_weekend_warrior: IMissionCheckFunction = async (payload) => {
		const { workout_id } = payload;

		if (workout_id && Types.ObjectId.isValid(workout_id)) {
			const workout = await WorkoutsModel.findById(workout_id);

			if (!workout) {
				return { completed: false };
			}

			const workout_date = new Date(workout.date);
			const day_of_week = workout_date.getDay(); // 0 (Sunday) to 6 (Saturday)

			if (day_of_week === 0 || day_of_week === 6) {
				return {
					completed: true,
				};
			}
		}

		return {
			completed: false,
		};
	};
	check_factotum: IMissionCheckFunction = async (payload) => {
		const result = await WorkoutsModel.aggregate([
			{ $match: { user: new Types.ObjectId(this.user._id) } },
			{
				$group: {
					_id: "$type",
				},
			},
		]);

		const completed_types = result.map((r) => r._id);
		const all_types = Object.values(WorkoutType);

		const missing_types = all_types.filter((t) => !completed_types.includes(t));

		const missing_any_type = missing_types.length > 0;
		return {
			completed: missing_any_type,
		};
	};
	check_a_hundred: IMissionCheckFunction = async (payload) => {
		const workouts_count = await WorkoutsModel.countDocuments({
			user: this.user._id,
		});

		if (workouts_count >= 100) {
			return {
				completed: true,
			};
		}

		return {
			completed: false,
		};
	};

	by_achievement_key: Record<WorkoutAchievementKeys, IMissionCheckFunction> = {
		"achievement:first_workout": this.check_first_workout,
		"achievement:night_owl": this.check_night_owl,
		"achievement:early_bird": this.check_early_bird,
		"achievement:weekend_warrior": this.check_weekend_warrior,
		"achievement:one_week_streak": this.check_one_week_streak,
		"achievement:a_hundred": this.check_a_hundred,
		"achievement:factotum": this.check_factotum,
		"achievement:speed_runner": this.check_speed_runner,
		"achievement:tik_tok": this.check_tik_tok,
		"achievement:one_month_streak": this.check_one_month_streak,
	};
}
