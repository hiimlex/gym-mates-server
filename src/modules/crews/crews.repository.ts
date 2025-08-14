import { cloudinaryDestroy } from "@config/cloudinary.config";
import { HttpException } from "@core/http_exception";
import { UsersModel } from "@modules/users";
import { WorkoutsModel } from "@modules/workouts";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { Types } from "mongoose";
import {
	IUserDocument,
	JourneyEventAction,
	JourneyEventSchemaType,
	TCrewMember,
	TFile,
	TJourneyEvent,
	TUploadedFile,
	TUser,
} from "types/collections";
import { CrewsModel } from "./crews.schema";
import CatchError from "decorators/catch_error";

class CrewsRepository {
	@CatchError(async (req) => {
		if (req.file) {
			await cloudinaryDestroy(req.file.filename);
		}
	})
	async create(req: Request, res: Response) {
		const file = req.file as TUploadedFile;
		const user = res.locals.user as IUserDocument;

		let banner: TFile | undefined = undefined;

		if (file) {
			banner = {
				public_id: file.filename,
				url: file.path,
			};
		}

		const { name, visibility, code, rules } = req.body;

		const member: TCrewMember = {
			user: user._id,
			is_admin: true,
			joined_at: new Date(),
		};

		const crew = await CrewsModel.create({
			name,
			visibility,
			code,
			banner,
			rules,
			members: [member],
			created_by: user._id,
		});

		// [Journey] - Add a journey event for the crew creation
		const event: TJourneyEvent = {
			_id: new Types.ObjectId(),
			action: JourneyEventAction.JOIN,
			schema: JourneyEventSchemaType.Crew,
			created_at: new Date(),
			data: {
				crew,
			},
		};
		await user.add_journey_event(event);

		return res.status(201).json(crew);
	}

	@CatchError(async (req) => {
		if (req.file) {
			await cloudinaryDestroy(req.file.filename);
		}
	})
	async update_banner(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;
		const file = req.file as TUploadedFile;
		const { crew_id } = req.body;

		if (!file) {
			throw new HttpException(400, "FILE_NOT_PROVIDED");
		}

		const crew = await CrewsModel.findById(crew_id);

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const is_admin = crew.members.some(
			(member) =>
				member.user.toString() === user._id.toString() && member.is_admin
		);

		if (!is_admin) {
			throw new HttpException(403, "FORBIDDEN");
		}

		if (crew.banner && crew.banner.public_id) {
			await cloudinaryDestroy(crew.banner.public_id);
		}

		const banner: TFile = {
			public_id: file.filename,
			url: file.path,
		};

		const updated_crew = await CrewsModel.findByIdAndUpdate(
			crew_id,
			{ banner },
			{ new: true }
		);

		return res.status(200).json(updated_crew);
	}

	@CatchError()
	async get_by_code(req: Request, res: Response) {
		const { code } = req.params;

		const crew = await CrewsModel.findOne({ code });

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		return res.status(200).json(crew);
	}

	@CatchError()
	async delete(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;

		const crew_id = req.params.id;

		const crew = await CrewsModel.findById(crew_id);

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const is_owner = crew.created_by.toString() === user._id.toString();

		if (!is_owner) {
			throw new HttpException(403, "FORBIDDEN");
		}

		await crew.deleteOne();

		// [Notify] - Notify the crew members that the crew has been deleted

		return res.sendStatus(204);
	}

	@CatchError()
	async update_config(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;

		const { crew_id } = req.body;

		const crew = await CrewsModel.findById(crew_id);

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const is_admin = crew.members.some(
			(member) =>
				member.user.toString() === user._id.toString() && member.is_admin
		);

		if (!is_admin) {
			throw new HttpException(403, "FORBIDDEN");
		}

		const { name, visibility, rules, lose_streak_in_days, streak } = req.body;

		const updated_crew = await CrewsModel.findByIdAndUpdate(
			crew_id,
			{
				visibility,
				rules,
				lose_streak_in_days,
				streak,
			},
			{ new: true }
		);

		return res.status(200).json(updated_crew);
	}

	@CatchError()
	async join(req: Request, res: Response) {
		const { code } = req.body;
		const user = res.locals.user as IUserDocument;

		const crew = await CrewsModel.findOne({ code });

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const is_member = crew.members.some(
			(m) => m.user.toString() === user._id.toString()
		);

		if (is_member) {
			throw new HttpException(400, "ALREADY_MEMBER");
		}

		const is_private = crew.visibility === "private";

		let joined = false;
		let in_whitelist = false;

		if (is_private) {
			await crew.updateOne({
				$addToSet: { white_list: user._id },
			});

			in_whitelist = true;
		}

		if (!is_private) {
			const new_member: TCrewMember = {
				user: user._id.toString(),
				is_admin: false,
				joined_at: new Date(),
			};

			await crew.updateOne({
				$addToSet: { members: new_member },
			});

			// [Notify] - Notify the crew of new member

			// [Journey] - Add a journey event for the crew join
			const event: TJourneyEvent = {
				_id: new Types.ObjectId(),
				action: JourneyEventAction.JOIN,
				schema: JourneyEventSchemaType.Crew,
				created_at: new Date(),
				data: {
					crew,
				},
			};
			await user.add_journey_event(event);

			joined = true;
		}

		return res.status(200).json({ joined, in_whitelist });
	}

	@CatchError()
	async leave(req: Request, res: Response) {
		const { code } = req.body;
		const { user } = res.locals;

		const crew = await CrewsModel.findOne({ code });

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const member = crew.members.find(
			(member) => member.user.toString() === user._id.toString()
		);

		if (!member) {
			throw new HttpException(400, "USER_NOT_A_MEMBER");
		}

		if (crew.created_by.toString() === user._id.toString()) {
			throw new HttpException(400, "CANNOT_LEAVE_CREW_OWNER");
		}

		await crew.updateOne({
			$pull: { members: member._id },
		});

		return res.sendStatus(204);
	}

	@CatchError()
	async update_admin(req: Request, res: Response) {
		const { user_id, code, set_admin } = req.body;

		const admin: IUserDocument = res.locals.user;

		const user = await UsersModel.findById(user_id);
		if (!user) {
			throw new HttpException(404, "USER_NOT_FOUND");
		}

		const crew = await CrewsModel.findOne({
			code,
		});

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const admin_in_crew = crew.members.some(
			(adm) => adm.user.toString() === admin._id.toString() && adm.is_admin
		);

		if (!admin_in_crew) {
			throw new HttpException(403, "FORBIDDEN");
		}

		const user_in_crew = crew.members.find(
			(member) => member.user.toString() === user._id.toString()
		);

		if (!user_in_crew) {
			throw new HttpException(400, "USER_NOT_A_MEMBER");
		}

		await CrewsModel.updateOne(
			{
				"members._id": user_in_crew._id,
			},
			{
				$set: {
					"members.$.is_admin": set_admin,
				},
			}
		);

		return res.sendStatus(204);
	}

	@CatchError()
	async accept_member(req: Request, res: Response) {
		const admin: IUserDocument = res.locals.user;
		const { user_id, code } = req.body;

		const new_member_user = await UsersModel.findById(user_id);

		if (!new_member_user) {
			throw new HttpException(404, "USER_NOT_FOUND");
		}

		const crew = await CrewsModel.findOne({
			code,
		});

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const admin_in_crew = crew.members.some(
			(adm) => adm.user.toString() === admin._id.toString() && adm.is_admin
		);

		if (!admin_in_crew) {
			throw new HttpException(403, "FORBIDDEN");
		}

		const user_in_white_list =
			crew.white_list &&
			crew.white_list.some(
				(member) => member._id.toString() === new_member_user._id.toString()
			);

		if (!user_in_white_list) {
			throw new HttpException(400, "USER_NOT_IN_WHITELIST");
		}

		const new_member: TCrewMember = {
			user: new_member_user._id as any,
			is_admin: false,
			joined_at: new Date(),
		};

		await crew.updateOne({
			$pull: { white_list: new_member_user._id },
			$addToSet: { members: new_member },
		});

		// [Notify] - Notify the user that they have been accepted into the crew

		// [Journey] - Add a journey event for the crew join
		const event: TJourneyEvent = {
			_id: new Types.ObjectId(),
			action: JourneyEventAction.JOIN,
			schema: JourneyEventSchemaType.Crew,
			created_at: new Date(),
			data: {
				crew,
			},
		};

		await new_member_user.add_journey_event(event);

		return res.sendStatus(204);
	}

	@CatchError()
	async reject_member(req: Request, res: Response) {
		const admin: IUserDocument = res.locals.user;
		const { user_id, code } = req.body;

		const new_member_user = await UsersModel.findById(user_id);

		if (!new_member_user) {
			throw new HttpException(404, "USER_NOT_FOUND");
		}

		const crew = await CrewsModel.findOne({
			code,
		});

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const admin_in_crew = crew.members.some(
			(adm) => adm.user.toString() === admin._id.toString() && adm.is_admin
		);

		if (!admin_in_crew) {
			throw new HttpException(403, "FORBIDDEN");
		}

		const user_in_white_list =
			crew.white_list &&
			crew.white_list.some(
				(member) => member._id.toString() === new_member_user._id.toString()
			);

		if (!user_in_white_list) {
			throw new HttpException(400, "USER_NOT_IN_WHITELIST");
		}

		await crew.updateOne({
			$pull: { white_list: new_member_user._id },
		});

		return res.sendStatus(204);
	}

	@CatchError()
	async kick_member(req: Request, res: Response) {
		const { user_id, code } = req.body;
		const admin: IUserDocument = res.locals.user;

		const user = await UsersModel.findById(user_id);

		if (!user) {
			throw new HttpException(404, "USER_NOT_FOUND");
		}

		const crew = await CrewsModel.findOne({
			code,
		});

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const admin_in_crew = crew.members.some(
			(adm) => adm.user.toString() === admin._id.toString() && adm.is_admin
		);

		if (!admin_in_crew) {
			throw new HttpException(403, "FORBIDDEN");
		}

		const member = crew.members.find(
			(member) => member.user.toString() === user._id.toString()
		);

		if (!member) {
			throw new HttpException(400, "USER_NOT_A_MEMBER");
		}

		crew.members.pull(member._id);
		await crew.save();

		// [Notify] - Notify the user that they have been removed from crew

		return res.sendStatus(204);
	}

	@CatchError()
	async get_rank(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;
		const { crew_id, show_all } = req.body;

		const crew = await CrewsModel.findById(crew_id);

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const is_member = crew.members.some(
			(member) => member.user.toString() === user._id.toString()
		);

		if (!is_member) {
			throw new HttpException(403, "FORBIDDEN");
		}

		const crew_populated = await crew.populate<{
			members: (TCrewMember & { user: TUser })[];
		}>("members");

		const rank = crew_populated.members
			.map((member) => ({
				_id: member.user._id,
				name: member.user.name,
				avatar: member.user.avatar,
				character: member.user.character,
				coins: member.user.coins || 0,
			}))
			.sort((a, b) => {
				return a.coins < b.coins ? 1 : -1;
			});

		if (!show_all) {
			const first_three = rank.slice(0, 3);

			return res.status(200).json(first_three);
		}

		return res.status(200).json(rank);
	}

	@CatchError()
	async get_activities(req: Request, res: Response) {
		const { crew_id } = req.body;
		const { start_date, end_date } = req.query;

		const start_date_obj = start_date
			? new Date(start_date as string)
			: new Date();

		const end_date_obj = end_date ? new Date(end_date as string) : new Date();

		start_date_obj.setHours(0, 0, 0, 0);
		end_date_obj.setHours(23, 59, 59, 999);

		const crew = await CrewsModel.findById(crew_id);
		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const workouts = await WorkoutsModel.find({
			shared_to: crew._id,
			user: { $in: crew.members.map((m) => m.user) },
			date: {
				$gte: start_date_obj,
				$lt: end_date_obj,
			},
		});

		return res.status(200).json(workouts);
	}

	@CatchError()
	async get_activities_days(req: Request, res: Response) {
		const { crew_id } = req.body;
		const { start_date, end_date } = req.query;

		const start_date_obj = start_date
			? new Date(start_date as string)
			: new Date();

		const end_date_obj = end_date ? new Date(end_date as string) : new Date();

		start_date_obj.setHours(0, 0, 0, 0);
		end_date_obj.setHours(23, 59, 59, 999);

		const crew = await CrewsModel.findById(crew_id);
		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const workouts = await WorkoutsModel.aggregate([
			{
				$match: {
					shared_to: crew._id,
					user: { $in: crew.members.map((m) => m.user) },
					date: {
						$gte: start_date_obj,
						$lt: end_date_obj,
					},
				},
			},
			{
				$group: {
					_id: {
						year: { $year: "$date" },
						month: { $month: "$date" },
						day: { $dayOfMonth: "$date" },
					},
					count: { $sum: 1 },
				},
			},
			{
				$sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
			},
		]);

		const activities_days = workouts.map((workout) => ({
			date: new Date(workout._id.year, workout._id.month - 1, workout._id.day),
			count: workout.count,
		}));

		return res.status(200).json(activities_days);
	}

	@CatchError()
	async favorite(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;
		const { crew_id } = req.body;

		const crew = await CrewsModel.findById(crew_id);

		if (!crew) {
			throw new HttpException(404, "CREW_NOT_FOUND");
		}

		const is_member = crew.members.some(
			(member) => member.user.toString() === user._id.toString()
		);

		if (!is_member) {
			throw new HttpException(403, "FORBIDDEN");
		}

		const is_favorite =
			!!user.favorites &&
			user.favorites.some((fav) => fav._id.toString() === crew._id.toString());

		if (!is_favorite) {
			await user.updateOne({
				$addToSet: { favorites: crew._id },
			});

			return res.sendStatus(204);
		}

		await user.updateOne({
			$pull: { favorites: crew._id },
		});

		return res.sendStatus(204);
	}
}

const CrewsRepositoryImpl = new CrewsRepository();

export { CrewsRepositoryImpl };
