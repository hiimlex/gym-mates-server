import { DecoratorController } from "@core/base_controller";
import { HttpException } from "@core/http_exception";
import { CatchError } from "@decorators/catch_error";
import { IsAuthenticated } from "@decorators/is_authenticated";
import { Get } from "@decorators/routes.decorator";
import { JourneyModel } from "@modules/journey";
import { Request, Response } from "express";
import { RootFilterQuery, Types } from "mongoose";
import {
	IJourneyDocument,
	IMissionDocument,
	IUserDocument,
	JourneyEventAction,
	JourneyEventSchemaType,
	TJourneyEvent,
} from "types/collections";
import { Endpoints } from "types/generics";
import { AchievementsModel } from "../items";
import { MissionsModel } from "./missions.schema";

class MissionsRepository extends DecoratorController {
	@Get(Endpoints.MissionsList)
	@CatchError()
	@IsAuthenticated()
	protected async list(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;
		const journey: IJourneyDocument = res.locals.journey;

		const query: RootFilterQuery<IMissionDocument> = {
			hidden: false,
			_id: { $nin: journey.completed_missions },
		};

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

		let filtered_missions: IMissionDocument[] = missions.filter((mission) => {
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
		});

		return res.status(200).json({ missions: filtered_missions });
	}

	@CatchError()
	public async complete_mission(
		user: IUserDocument,
		mission_id: Types.ObjectId
	) {
		const journey = await JourneyModel.findById(user.journey);

		if (!journey) {
			throw new HttpException(404, "JOURNEY_NOT_FOUND");
		}
		// find mission
		//
		const mission = await MissionsModel.findById(mission_id);

		if (!mission) {
			throw new HttpException(404, "MISSION_NOT_FOUND");
		}

		const achievement = await AchievementsModel.findById(mission.achievement);

		if (!achievement) {
			throw new HttpException(404, "MISSION_ACHIEVEMENT_NOT_FOUND");
		}

		// check if mission already completed
		//
		const already_completed = journey.completed_missions.find((m) =>
			m.equals(mission._id)
		);

		if (already_completed) {
			throw new HttpException(400, "ALREADY_COMPLETED");
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
			throw new HttpException(400, "MISSION_REQUIREMENTS_NOT_MET");
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
					journey.inventory.push(achievement._id);
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
	}
}

export const MissionsRepositoryImpl = new MissionsRepository();
