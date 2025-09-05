import { emitBusEvent } from "@config/events.config";
import { DecoratorController } from "@core/base_controller";
import { HttpException } from "@core/http_exception";
import { CatchError } from "@decorators/catch_error";
import { IsAuthenticated } from "@decorators/is_authenticated";
import { Get, Post } from "@decorators/routes.decorator";
import { JourneyModel } from "@modules/journey";
import { Request, Response } from "express";
import { RootFilterQuery, Types } from "mongoose";
import {
	IJourneyDocument,
	IMissionDocument,
	IUserDocument,
	IWorkoutMissionsCheckFunctions,
	JourneyEventAction,
	JourneyEventSchemaType,
	MissionContext,
	TInventoryItem,
	TJourneyEvent,
	WorkoutAchievementKeys,
} from "types/collections";
import { BusEventType, Endpoints, IBusEventPayload } from "types/generics";
import { AchievementsModel } from "../items";
import { MissionsModel } from "./missions.schema";
import { WorkoutMissionsCheckFunctions } from "./workouts.missions";

class MissionsRepository extends DecoratorController {
	@Get(Endpoints.MissionsList)
	@CatchError()
	@IsAuthenticated()
	protected async list(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;
		const journey: IJourneyDocument = res.locals.journey;

		const available_missions = await this.get_available_missions(
			user,
			journey,
			undefined,
			false
		);

		return res.status(200).json({ missions: available_missions });
	}

	@CatchError()
	public async complete_mission(
		user: IUserDocument,
		mission_id: Types.ObjectId
	) {
		const journey = await JourneyModel.findById(user.journey);

		if (!journey) {
			throw new Error("User journey not found");
		}

		const mission = await MissionsModel.findById(mission_id);

		if (!mission) {
			throw new Error("Mission not found");
		}

		const achievement = await AchievementsModel.findById(mission.achievement);

		if (!achievement) {
			throw new Error("Mission achievement not found");
		}

		// check if mission already completed
		//
		const already_completed = journey.completed_missions.find((m) =>
			m.equals(mission._id)
		);

		if (already_completed) {
			throw new Error("Mission already completed");
		}
		// check if user met requirements for the mission
		//
		const user_achievements = await user.get_achievements();
		const user_achievements_keys = user_achievements.map((ach) =>
			ach.key.toString()
		);
		const mission_requirements = mission.requirements || [];

		const met_requirements = mission_requirements.every((requirement) =>
			user_achievements_keys.includes(requirement)
		);

		if (!met_requirements) {
			throw new Error("Mission requirements not met");
		}
		// add mission achievement to journey inventory items
		//
		if (mission.achievement) {
			const achievement = await AchievementsModel.findById(mission.achievement);
			if (achievement) {
				const has_achievement = user_achievements.find(
					(ach) => ach.key === achievement.key
				);

				if (!has_achievement) {
					const inventoryItem: TInventoryItem = {
						item: achievement._id,
						owned_at: new Date(),
					};

					journey.inventory.push(inventoryItem);
				}
			}
		}
		// add mission to journey completed_missions
		//
		journey.completed_missions.push(mission._id);
		// give rewards
		if (mission.reward) {
			user.coins += mission.reward;
		}
		// save entities
		//
		await journey.save();
		await user.save();
		// generate journey event for the mission completion
		//
		const event: TJourneyEvent = {
			_id: new Types.ObjectId(),
			schema: JourneyEventSchemaType.Mission,
			action: JourneyEventAction.COMPLETE_MISSION,
			data: {
				mission,
				achievement,
			},
			created_at: new Date(),
		};

		await user.add_journey_event(event);
		// [Notify] - Notify the user about the new achievement
	}

	@CatchError()
	public async get_available_missions(
		user: IUserDocument,
		journey: IJourneyDocument,
		context?: MissionContext,
		show_hidden = true
	): Promise<IMissionDocument[]> {
		// get completed missions
		const completed_missions =
			journey.completed_missions.map((m) => m._id.toString()) || [];

		const query: RootFilterQuery<IMissionDocument> = {
			hidden: show_hidden ? { $in: [true, false] } : false,
			_id: { $nin: completed_missions },
		};

		if (context) {
			query.context = context;
		}

		// check the missions available for the user
		const missions = await MissionsModel.find(query).populate({
			path: "achievement",
			select: "category key rarity",
		});
		// get user achievements
		// get user achievements
		const achievements = await user.get_achievements();
		const user_achievements = achievements.map((achievement) =>
			achievement.key.toString()
		);

		const available_missions: IMissionDocument[] = missions.filter(
			(mission) => {
				// Check mission requirements
				const mission_requirements = mission.requirements || [];

				if (mission_requirements.length === 0) {
					return mission;
				}

				// Check if user has all required achievements
				const met_requirements = mission_requirements.every((requirement) =>
					user_achievements.includes(requirement)
				);

				if (!met_requirements) {
					return undefined;
				}

				return mission;
			}
		);

		return available_missions;
	}

	@Post(Endpoints.MissionsTest)
	@CatchError()
	@IsAuthenticated()
	protected async test(req: Request, res: Response) {
		const { data, context } = req.body;
		const user: IUserDocument = res.locals.user;

		emitBusEvent(BusEventType.WorkoutCompleted, { user, context, data });

		return res.status(200).json({ success: true });
	}

	@CatchError()
	public async on_event(payload: IBusEventPayload) {
		const { user, context, data } = payload;

		// get journey
		const journey = await JourneyModel.findById(user?.journey);

		if (!user || !journey) {
			return;
		}
		// get available missions for user in event context (including hidden)
		const available_missions =
			await MissionsRepositoryImpl.get_available_missions(
				user,
				journey,
				context,
				true
			);

		const achievements = await AchievementsModel.find({
			_id: { $in: available_missions.map((m) => m.achievement._id) },
		});

		if (context === MissionContext.Workout) {
			// get context check functions class
			const CheckFunctions = new WorkoutMissionsCheckFunctions(user, journey);

			// iterate available missions and check for completed
			for (const mission of available_missions) {
				const ach_doc = achievements.find(
					(a) => a._id.toString() === mission.achievement._id.toString()
				);

				if (!ach_doc) {
					console.log("No achievement for mission", mission.name);
					continue;
				}

				const key = ach_doc.key.toString() as WorkoutAchievementKeys;

				const check_fn = CheckFunctions.by_achievement_key[key];

				if (!check_fn) {
					console.log("No check function for achievement key", key);
					continue;
				}

				if (data) {
					const result = await check_fn(data);
					// if completed, complete the mission for the user
					console.log(`Mission ${mission.name} check fn result`, result);
					if (result.completed) {
						console.log(`Mission ${mission.name} completed!`);
						await MissionsRepositoryImpl.complete_mission(user, mission._id);
					}
				}
			}
		}
	}
}

export const MissionsRepositoryImpl = new MissionsRepository();
