import { HttpException } from "@core/http_exception";
import { CrewsModel } from "@modules/crews";
import { calculate_coins } from "@utils/coin.helper";
import { handle_error } from "@utils/handle_error";
import {
	recalculate_user_streak,
	validate_workout_rules,
} from "@utils/workout.helper";
import { Request, Response } from "express";
import { Types } from "mongoose";
import {
	CrewStreak,
	IUserDocument,
	JourneyEventAction,
	JourneyEventSchemaType,
	TFile,
	TJourneyEvent,
	TUploadedFile,
} from "types/collections";
import { WorkoutsModel } from "./workouts.schema";
import { cloudinaryDestroy } from "@config/cloudinary.config";
import { DecoratorController } from "@core/base_controller";
import { Post } from "../../decorators/routes.decorator";
import { Endpoints } from "types/generics";
import { Upload } from "../../decorators/upload.decorator";
import { CatchError } from "../../decorators/catch_error";
import { IsAuthenticated } from "../../decorators/is_authenticated";

class WorkoutsRepository extends DecoratorController {
	@Post(Endpoints.WorkoutsCreate)
	@CatchError(async (_, res) => {
		const user: IUserDocument = res.locals.user;
		const old_streak_count = res.locals.old_streak_count;

		if (!!old_streak_count) {
			await user.updateOne({
				day_streak: old_streak_count,
			});
		}
	})
	@IsAuthenticated()
	@Upload()
	protected async create(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;
		const { title, date, type, duration } = req.body;
		const file = req.file as TUploadedFile;
		let shared_to = req.body.shared_to || [];

		let picture: TFile | undefined = undefined;

		if (file) {
			picture = {
				public_id: file.filename,
				url: file.path,
			};
		}

		const crews = await CrewsModel.find({
			_id: { $in: shared_to },
			"members.user": { $in: [user._id] },
		});

		if (!crews.length) {
			throw new HttpException(400, "CREW_NOT_FOUND");
		}

		// [Rules] - Check crew rules, about
		// Paid at any time
		// Paid without picture
		// Gym focused
		// Future dates
		const workout_date = new Date(date);
		await validate_workout_rules(
			crews,
			workout_date,
			picture?.url ?? undefined,
			type
		);

		// [Validations] - Check if the workout date is in the past
		// and the user had lost streak
		// should recalculate the streak
		// from the previous lost streak date and the workout date
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const is_past = workout_date < today;

		if (is_past) {
			await recalculate_user_streak(user, res);
		}

		// [StreakSystem] - Update user streak count
		// check if has a registered workout on the same day
		const gte = new Date(workout_date);
		const lte = new Date(workout_date);
		const workout_in_day = await WorkoutsModel.findOne({
			user: user._id,
			date: {
				$gte: gte.setHours(0, 0, 0, 0),
				$lt: lte.setHours(23, 59, 59, 999),
			},
		});
		// Check crews streak system
		const crew_streaks = new Set<CrewStreak>(
			crews
				.map((c) => c.streak as CrewStreak[])
				.reduce((previous, current) => [...previous, ...(current || [])], [])
		);
		const day_streak = (user.day_streak || 0) + 1;

		const { coins, receipt } = await calculate_coins(
			crew_streaks,
			day_streak,
			workout_date
		);

		// Create workout
		const workout = await WorkoutsModel.create({
			user: user._id,
			title,
			picture,
			date,
			type,
			duration,
			shared_to: crews.map((crew) => crew._id),
			earned: !workout_in_day ? coins : 0,
			receipt: !workout_in_day ? receipt : undefined,
		});

		// [CoinSystem] - Add coins to the user for creating a workout
		// Update the user's streak and coins
		// if the user has no workout registered on the same day
		if (!workout_in_day) {
			await user.updateOne({
				day_streak,
				coins: user.coins + coins,
			});
		}

		// // [TODO] [Notify] - Notify the crews about the PAID

		// // [Journey] - Add a journey event for the user
		const event: TJourneyEvent = {
			_id: new Types.ObjectId(),
			action: JourneyEventAction.PAID,
			created_at: new Date(),
			schema: JourneyEventSchemaType.Workout,
			data: {
				workout,
			},
		};

		await user.add_journey_event(event);
		await user.add_workout(workout._id);

		return res.status(201).json(workout);
	}
}

const WorkoutsRepositoryImpl = new WorkoutsRepository();
export { WorkoutsRepositoryImpl };
