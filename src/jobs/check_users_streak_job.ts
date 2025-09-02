import cron from "node-cron";
import { UsersModel } from "@modules/users";
import { JourneyModel } from "@modules/journey";
import { CrewsModel } from "@modules/crews";
import { WorkoutsModel } from "@modules/workouts";
import { UserCheckInModel } from "@modules/user_check_in";
import {
	JourneyEventAction,
	JourneyEventSchemaType,
	TJourneyEvent,
} from "types/collections";
import { Types } from "mongoose";

/* Cron job to check user streaks every day at 23:00
	* This job will check all users for their workout streaks and update their records accordingly.
	* If a user has not logged a workout within the allowed period defined by their crew's lose_streak_in_days,
	* their streak will be reset and a journey event will be created to notify them of the change.
	* The job also ensures that users are not checked multiple times in a short period by verifying the last_streak_check timestamp.
	* Users without any crew memberships are skipped, as streaks are tied to crew participation.
	* Logs are generated to track the job's execution and any streak changes for users.
	* This helps maintain user engagement and encourages regular workout logging.
	* 
	* If the user logs any workout in past, the streak will be recalculated on the workout creation logic. 
	* Described in 'workout.helper.ts' file.
	*/
cron.schedule("0 23 * * *", async () => {
	const job_date = new Date();
	console.log("Cron job running at", job_date.toISOString());
	// call your streak check logic here
	const users = await UsersModel.find();
	console.log(`Found ${users.length} users to check for streaks.`);

	for (const user of users) {
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
			continue;
		}

		if (
			last_checked_date &&
			job_date.getTime() - last_checked_date.getTime() < 1000 * 60 * 1
		) {
			console.log("User was checked less than a minute ago, skipping.");
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
		else if (!last_workout && user_streak > 0) {
			// create journey event for losing streak
			const event: TJourneyEvent = {
				_id: new Types.ObjectId(),
				action: JourneyEventAction.LOSE_STREAK,
				schema: JourneyEventSchemaType.Workout,
				data: {
					last_workout_date: null,
					lose_streak_at: job_date,
					lose_streak_in_days,
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
});
