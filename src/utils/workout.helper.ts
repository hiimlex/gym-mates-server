import { HttpException } from "@core/http_exception";
import { JourneyModel } from "@modules/journey";
import { WorkoutsModel } from "@modules/workouts";
import { Response } from "express";
import {
	ICrewDocument,
	IUserDocument,
	JourneyEventAction,
	TJourneyEvent,
	WorkoutType,
} from "types/collections";

export async function validate_workout_rules(
	crews: ICrewDocument[],
	workout_date: Date,
	picture: string | undefined,
	type: WorkoutType
) {
	return new Promise<void>((resolve, reject) => {
		const cannot_pay_on_past_days = crews.some(
			(crew) => !crew.rules?.pay_on_past
		);
		const cannot_pay_without_picture = crews.some(
			(crew) => !crew.rules?.pay_without_picture
		);
		const gym_focused = crews.some((crew) => crew.rules?.gym_focused);

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const is_past = workout_date < today;
		if (is_past && cannot_pay_on_past_days) {
			reject(
				new HttpException(400, "CREW_RULES_VIOLATION", {
					paid_at_anytime: false,
					crews: crews.filter((crew) => !crew.rules?.pay_on_past),
				})
			);
		}
		if (!picture && cannot_pay_without_picture) {
			reject(
				new HttpException(400, "CREW_RULES_VIOLATION", {
					paid_without_picture: false,
					crews: crews.filter((crew) => !crew.rules?.pay_without_picture),
				})
			);
		}
		if (gym_focused && type !== WorkoutType.Gym) {
			reject(
				new HttpException(400, "CREW_RULES_VIOLATION", {
					gym_focused: true,
					crews: crews.filter((crew) => crew.rules?.gym_focused),
				})
			);
		}

		// Validating workout date
		// check if the workout date is at least two days in the past
		if (workout_date < new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)) {
			reject(new HttpException(400, "WORKOUT_DATE_TOO_OLD"));
		}
		// check if the workout date is in the future
		if (workout_date > new Date()) {
			reject(new HttpException(400, "WORKOUT_DATE_IN_FUTURE"));
		}
		// check if the workout date is older than crew created date
		const crew_created_dates = crews.map(
			(crew) => !!crew.created_at && new Date(crew.created_at)
		);
		const oldest_crew_date = new Date(
			Math.min(...crew_created_dates.map((date) => date.getTime()))
		);

		if (workout_date < oldest_crew_date) {
			reject(new HttpException(400, "WORKOUT_DATE_OLDER_THAN_CREW"));
		}

		resolve();
	});
}

export async function recalculate_user_streak(
	user: IUserDocument,
	res: Response
) {
	return new Promise<void>(async (resolve, reject) => {
		const user_has_streak = (user.day_streak || 0) > 0;
		const user_workouts = await WorkoutsModel.find({
			user: user._id,
		});

		if (user_has_streak || user_workouts.length === 0) {
			resolve();

			return;
		}

		const journey = await JourneyModel.findOne({
			user: user._id,
		});

		if (!journey) {
			reject(new HttpException(404, "JOURNEY_NOT_FOUND"));
		}

		const lost_streak_at = journey?.events?.filter((event) => {
			if (event.action === JourneyEventAction.LOSE_STREAK) {
				return event;
			}
		});

		if (!lost_streak_at || lost_streak_at?.length === 0) {
			resolve();

			return;
		}

		let streak_count_start_date: Date | undefined = undefined;
		let streak_count_end_date: Date | undefined = undefined;
		let last_lost_streak_event: TJourneyEvent | undefined = undefined;

		if (lost_streak_at && lost_streak_at.length < 2) {
			const last_event = lost_streak_at[0];
			streak_count_end_date = new Date(last_event.created_at);
			streak_count_start_date = new Date(user.created_at);
			last_lost_streak_event = last_event;
		}

		if (lost_streak_at && lost_streak_at.length >= 2) {
			const first_event = lost_streak_at[0];
			const second_event = lost_streak_at[1];
			streak_count_end_date = new Date(second_event.created_at);
			streak_count_start_date = new Date(first_event.created_at);

			last_lost_streak_event = first_event;
		}
		// [TODO] - Get the workouts between the dates to recalculate the streak
		const workouts = await WorkoutsModel.find({
			user: user._id,
			date: {
				$gte: streak_count_start_date?.setHours(0, 0, 0, 0),
				$lt: streak_count_end_date?.setHours(23, 59, 59, 999),
			},
		});

		const streak_count = workouts.length;
		res.locals.old_streak_count = user.day_streak || 0;

		user.day_streak = streak_count;
		await user.save();
		// [TODO] - Remove the last streak event from journey
		if (last_lost_streak_event) {
			await JourneyModel.updateOne(
				{ _id: user.journey },
				{
					$pull: {
						events: {
							_id: last_lost_streak_event._id,
						},
					},
				}
			);
		}

		resolve();
	});
}
