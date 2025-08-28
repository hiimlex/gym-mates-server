import { DecoratorController } from "@core/base_controller";
import { HttpException } from "@core/http_exception";
import { CrewsModel } from "@modules/crews";
import { HealthyModel } from "@modules/healthy";
import { TitlesModel } from "@modules/items";
import { JourneyModel } from "@modules/journey";
import { UserDeviceModel } from "@modules/user_device";
import { destroyCloudinaryFileOnError } from "@utils/destroyCloudinaryFileOnError";
import { compareSync, hashSync } from "bcrypt";
import { Request, Response } from "express";
import { Types } from "mongoose";
import {
	IJourneyDocument,
	IUserDocument,
	IUserFollowerInfo,
	JourneyEventAction,
	JourneyEventSchemaType,
	TJourneyEvent,
	TUploadedFile,
} from "types/collections";
import { Endpoints, HashSalt } from "types/generics";
import { CatchError } from "../../decorators/catch_error";
import { UsersModel } from "./users.schema";
import { Get, Post, Put } from "../../decorators/routes.decorator";
import { IsAuthenticated } from "../../decorators/is_authenticated";
import { Upload } from "../../decorators/upload.decorator";

class UsersRepository extends DecoratorController {
	@Get(Endpoints.UsersGetJourney)
	@CatchError()
	@IsAuthenticated()
	protected async get_journey(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;

		const journey = await JourneyModel.findById(user.journey);

		if (!journey) {
			throw new HttpException(404, "JOURNEY_NOT_FOUND");
		}

		const populated_journey = await journey.populate({
			path: "inventory.item",
		});

		if (req.query.sort) {
			const sort = req.query.sort as string;
			populated_journey.events.sort((a, b) => {
				if (sort === "recent") {
					return (
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
					);
				}
				return 0;
			});
		}

		if (req.query.action) {
			const action = req.query.action as JourneyEventAction;
			populated_journey.events = populated_journey.events.filter(
				(event) => event.action === action
			) as any;
		}

		return res.status(200).json(populated_journey);
	}

	@Get(Endpoints.UsersGetFollowersInfo)
	@CatchError()
	@IsAuthenticated()
	protected async get_followers_info(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;

		const user_followers = await UsersModel.find({
			_id: { $in: user.followers },
		}).select("-password -email -healthy -journey");

		const user_following = await UsersModel.find({
			_id: { $in: user.following },
		}).select("-password -email -healthy -journey");

		const followers: IUserFollowerInfo[] = [];
		const following: IUserFollowerInfo[] = [];

		await Promise.all(
			user_followers.map(async (follower) => {
				const is_mutual = user.following?.some(
					(uf) => uf._id.toString() === follower._id.toString()
				);

				const crews_in_common = await CrewsModel.find({
					"members.user": { $all: [user._id, follower._id] },
				});

				followers.push({
					user: follower,
					is_mutual,
					in_crews: crews_in_common,
				});
			})
		);

		await Promise.all(
			user_following.map(async (follow) => {
				const is_mutual = user.followers?.some(
					(uf) => uf._id.toString() === follow._id.toString()
				);

				const crews_in_common = await CrewsModel.find({
					"members.user": { $all: [user._id, follow._id] },
				});

				following.push({
					user: follow,
					is_mutual,
					in_crews: crews_in_common,
				});
			})
		);

		return res.status(200).json({
			followers: followers,
			following: following,
		});
	}

	@Post(Endpoints.UsersFollow)
	@CatchError()
	@IsAuthenticated()
	protected async follow(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;

		const { follower_id } = req.body;

		const friend = await UsersModel.findById(follower_id);

		if (!friend) {
			throw new HttpException(404, "USER_NOT_FOUND");
		}

		const already_following = friend.followers?.includes(follower_id);

		if (already_following) {
			throw new HttpException(400, "ALREADY_FOLLOWING");
		}

		await friend.updateOne({
			$addToSet: { followers: user._id },
		});

		await user.updateOne({
			$addToSet: { following: follower_id },
		});

		// [Notify] - Notify the friend about the new follower

		// [Journey] - Add a new event to the user's journey
		const event: TJourneyEvent = {
			_id: new Types.ObjectId(),
			action: JourneyEventAction.FOLLOW,
			schema: JourneyEventSchemaType.User,
			data: {
				user: user,
			},
			created_at: new Date(),
		};
		await user.add_journey_event(event);

		return res.sendStatus(204);
	}

	@Post(Endpoints.UsersUnfollow)
	@CatchError()
	@IsAuthenticated()
	protected async unfollow(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;

		const { follower_id } = req.body;

		const follower = await UsersModel.findById(follower_id);

		if (!follower) {
			throw new HttpException(404, "USER_NOT_FOUND");
		}

		await follower.updateOne({
			$pull: { followers: user._id },
		});

		await user.updateOne({
			$pull: { following: follower_id },
		});

		return res.sendStatus(204);
	}

	@Post(Endpoints.UsersCreateHealthy)
	@CatchError()
	@IsAuthenticated()
	protected async create_healthy(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;

		const { weight, height, body_fat } = req.body;

		const healthy_info = await HealthyModel.create({
			weight,
			height,
			body_fat,
			user: user._id,
		});

		await user.updateOne({
			$set: { healthy: healthy_info._id },
		});

		// [Journey] - Add a new event to the user's journey
		const event: TJourneyEvent = {
			_id: new Types.ObjectId(),
			action: JourneyEventAction.ADD,
			schema: JourneyEventSchemaType.Healthy,
			data: {
				healthy_info,
			},
			created_at: new Date(),
		};
		await user.add_journey_event(event);

		return res.status(200).json(healthy_info);
	}

	@Put(Endpoints.UsersSelectTitle)
	@CatchError()
	@IsAuthenticated()
	protected async select_title(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;
		const journey: IJourneyDocument = res.locals.journey;

		const { title_id } = req.body;

		const title = await TitlesModel.findById(title_id);

		if (!title || !title_id) {
			throw new HttpException(404, "TITLE_NOT_FOUND");
		}

		if (!journey.inventory.some((item) => item.item.toString() === title_id)) {
			throw new HttpException(400, "USER_DOES_NOT_OWN_ITEM");
		}

		await user.updateOne({
			$set: { title: title._id },
		});

		return res.sendStatus(204);
	}

	@Put(Endpoints.UsersUpdateAvatar)
	@CatchError()
	@IsAuthenticated()
	@Upload()
	protected async update_avatar(req: Request, res: Response) {
		const file = req.file as TUploadedFile;
		const user: IUserDocument = res.locals.user;

		if (!file) {
			throw new HttpException(400, "FILE_NOT_PROVIDED");
		}

		if (!user) {
			throw new HttpException(404, "USER_NOT_FOUND");
		}

		const updated_user = await UsersModel.findByIdAndUpdate(
			user._id,
			{
				avatar: {
					public_id: file.filename,
					url: file.path,
				},
			},
			{ new: true }
		);

		return res.status(200).json(updated_user);
	}

	@Put(Endpoints.UsersUpdateProfile)
	@CatchError()
	@IsAuthenticated()
	protected async update_profile(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;

		const { name, email, oldPassword, newPassword } = req.body;

		if (oldPassword && newPassword) {
			const is_password_valid = compareSync(oldPassword, user.password);

			if (!is_password_valid) {
				throw new HttpException(403, "UNAUTHORIZED");
			}
			const hash_password = hashSync(newPassword, HashSalt);
			user.password = hash_password;
		}

		if (name) {
			user.name = name;
		}
		if (email) {
			user.email = email;
		}

		await user.save();

		return res.status(200).json(user);
	}

	@Post(Endpoints.UsersRegisterDeviceToken)
	@CatchError()
	@IsAuthenticated()
	protected async register_device_token(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;

		const { pushToken, deviceInfo } = req.body;

		if (!pushToken) {
			throw new HttpException(400, "DEVICE_TOKEN_NOT_PROVIDED");
		}

		const user_device = await UserDeviceModel.findOne({ user: user._id });

		if (user_device) {
			if (user_device.pushToken === pushToken) {
				return res.sendStatus(204);
			}

			await user_device.updateOne({ pushToken });
		}

		if (!user_device) {
			await UserDeviceModel.create({
				user: user._id,
				pushToken,
				deviceInfo,
				lastActive: new Date(),
			});
		}

		return res.sendStatus(204);
	}
}

export const UsersRepositoryImpl = new UsersRepository();
