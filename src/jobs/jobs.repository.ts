import { DecoratorController } from "@core/base_controller";
import { HttpException } from "@core/http_exception";
import { CatchError } from "@decorators/catch_error";
import { IsAdmin } from "@decorators/is_admin.decorator";
import { Post } from "@decorators/routes.decorator";
import { CrewsModel } from "@modules/crews";
import { JourneyModel } from "@modules/journey";
import { UserCheckInModel } from "@modules/user_check_in";
import { UsersModel } from "@modules/users";
import { WorkoutsModel } from "@modules/workouts";
import { Request, Response } from "express";
import { Types } from "mongoose";
import {
	JourneyEventAction,
	JourneyEventSchemaType,
	TJourneyEvent,
} from "types/collections";
import { Endpoints } from "types/generics";

class JobsRepository extends DecoratorController {
	@Post(Endpoints.JobsCheckUsersStreak)
	@CatchError()
	protected async check_users_streak(req: Request, res: Response) {
		if (req.headers["x-cron-secret"] !== process.env.SUDO_KEY) {
			throw new HttpException(403, "FORBIDDEN");
		}

		const job_date = new Date();
		console.log("Cron job running at", job_date.toISOString());
		// call your streak check logic here
		const users = await UsersModel.find();
		console.log(`Found ${users.length} users to check for streaks.`);

		for (const user of users) {
			console.log(`Checking user ${user.name} (${user._id})`);

			if (user.day_streak === 0) {
				console.log(`User ${user.name} has no streak, skipping.`);
				continue;
			}
			// get user check-in
			let user_check_in = await UserCheckInModel.findOne({
				user: user._id,
			});
			// if the user has no  user-check-in data create one
			if (!user_check_in) {
				user_check_in = await UserCheckInModel.create({
					user: user._id,
				});
			}
			const last_checked_date = user_check_in.last_streak_check;
			const user_streak = user.day_streak || 0;

			// check if the user was checked in this day
			const user_already_checked_today = last_checked_date
				? last_checked_date.getDate() === job_date.getDate() &&
				  last_checked_date.getMonth() === job_date.getMonth() &&
				  last_checked_date.getFullYear() === job_date.getFullYear()
				: false;

			if (user_already_checked_today) {
				console.log(`User ${user.name} already checked today, skipping.`);
				continue;
			}

			// get user journey
			const journey = await JourneyModel.findById(user.journey);
			// get user crews
			const crews = await CrewsModel.find({
				"members.user": { $in: [user._id] },
			});
			// If user is not in any crew, skip
			if (crews.length === 0) {
				console.log(`User ${user.name} is not in any crew, skipping.`);
				continue;
			}
			// get crew lose_streak_days min
			const lose_streak_in_days = Math.min(
				...crews.map((crew) => crew.lose_streak_in_days || 0)
			);

			// get user last workout
			const last_workout = await WorkoutsModel.findOne({
				user: user._id,
			})
				.sort({ date: -1 })
				.limit(1);
			// If user has no workouts and no streak, do nothing
			if (!last_workout && (user.day_streak || 0) === 0) {
				console.log(
					`User ${user.name} has no workouts and no streak, skipping.`
				);
				continue;
			}

			// check if user last workout is older than lose_streak_in_days
			if (last_workout) {
				const last_workout_date = new Date(last_workout.date);
				const days_since_last_workout = Math.floor(
					(job_date.getTime() - last_workout_date.getTime()) /
						(1000 * 60 * 60 * 24)
				);

				if (days_since_last_workout > lose_streak_in_days && user_streak > 0) {
					console.log(
						`User ${user.name} has lost their streak of ${user_streak} days.`
					);
					// create journey event for losing streak
					const event: TJourneyEvent = {
						_id: new Types.ObjectId(),
						action: JourneyEventAction.LOSE_STREAK,
						schema: JourneyEventSchemaType.Workout,
						data: {
							last_workout_date,
							lose_streak_at: job_date,
							lose_streak_in_days,
							user_streak,
						},
						created_at: new Date(),
					};

					await user.add_journey_event(event);
					// reset user streak
					await user.updateOne({
						day_streak: 0,
					});
					// update user_check_in last_streak_check
					await user_check_in.updateOne({
						last_streak_check: job_date,
					});
				}
			}
			// check if the user has no workouts but has a streak
			if (!last_workout && user_streak > 0) {
				console.log(
					`User ${user.name} has lost their streak of ${user_streak} days (no workouts).`
				);
				// create journey event for losing streak
				const event: TJourneyEvent = {
					_id: new Types.ObjectId(),
					action: JourneyEventAction.LOSE_STREAK,
					schema: JourneyEventSchemaType.Workout,
					data: {
						lose_streak_at: job_date,
						lose_streak_in_days,
						user_streak,
					},
					created_at: new Date(),
				};

				await user.add_journey_event(event);
				// reset user streak
				await user.updateOne({
					day_streak: 0,
				});
				// update user_check_in last_streak_check
				await user_check_in.updateOne({
					last_streak_check: job_date,
				});
			}
		}

		return res.status(200).json({
			status: "success",
			message: "Streak check completed",
			date: job_date.toISOString(),
		});
	}
}

export const JobsRepositoryImpl = new JobsRepository();
