import { DecoratorController } from "@core/base_controller";
import { HttpException } from "@core/http_exception/http_exception";
import { JourneyModel } from "@modules/journey";
import { compareSync, hashSync } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { decode, sign } from "jsonwebtoken";
import { Types } from "mongoose";
import {
	IUserDocument,
	JourneyEventAction,
	JourneyEventSchemaType,
	TFile,
	TJourneyEvent,
	TUploadedFile,
} from "types/collections";
import { Endpoints, HashSalt, JwtExpiresIn, JwtSecret } from "types/generics";
import { CatchError } from "../../decorators/catch_error";
import { IsAuthenticated } from "../../decorators/is_authenticated";
import { Get, Post } from "../../decorators/routes.decorator";
import { Upload } from "../../decorators/upload.decorator";
import { UsersModel } from "../users";

class AuthRepository extends DecoratorController {
	@Post(Endpoints.AuthLogin)
	@CatchError()
	async login(req: Request, res: Response) {
		const { email, password } = req.body;

		const user = await UsersModel.findOne({ email });

		if (!user) {
			throw new HttpException(404, "USER_NOT_FOUND");
		}

		const is_password_valid = compareSync(password, user.password);

		if (!is_password_valid) {
			throw new HttpException(400, "INVALID_CREDENTIALS");
		}

		const access_token = sign({ id: user._id.toString() }, JwtSecret, {
			expiresIn: JwtExpiresIn,
		});

		await user.updateOne({
			access_token: access_token.toString(),
		});

		return res.status(200).send({
			access_token,
		});
	}

	@Post(Endpoints.AuthSignUp)
	@CatchError()
	@Upload()
	async sign_up(req: Request, res: Response) {
		const file = req.file as TUploadedFile;
		const { email, password, name } = req.body;
		let avatar: TFile | undefined = undefined;

		if (file) {
			avatar = {
				public_id: file.filename,
				url: file.originalname,
			};
		}

		const hash_password = hashSync(password, HashSalt);

		const user = await UsersModel.create({
			email,
			password: hash_password,
			name,
			avatar,
		});

		// [Journey] - Create a journey for the user
		const start_event: TJourneyEvent = {
			_id: new Types.ObjectId(),
			action: JourneyEventAction.START,
			schema: JourneyEventSchemaType.User,
			created_at: new Date(),
			data: {
				user: user.toJSON(),
			},
		};

		const user_journey = await JourneyModel.create({
			user: user._id,
			events: [start_event],
			inventory: [],
			healthy: [],
			workouts: [],
		});

		const access_token = sign({ id: user._id.toString() }, JwtSecret, {
			expiresIn: JwtExpiresIn,
		});

		await user.updateOne({
			access_token: access_token.toString(),
			journey: user_journey._id,
		});

		return res.status(201).json({ access_token, user });
	}

	@Get(Endpoints.AuthMe)
	@IsAuthenticated()
	async me(req: Request, res: Response) {
		const user: IUserDocument = res.locals.user;

		if (!user) {
			throw new HttpException(404, "USER_NOT_FOUND");
		}

		// [StreakSystem] - Check user streak if the user has lost streak based on crews

		await user.populate({ path: "title journey" });
		await user.populate({
			path: "followers following",
			select: "-access_token -password -created_at -updated_at",
		});

		return res.status(200).json(user);
	}

	public async is_authenticated(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const access_token = req.headers.authorization?.split(" ")[1];

		if (!access_token) {
			throw new HttpException(401, "UNAUTHORIZED");
		}

		const decoded_token = decode(access_token);

		if (!decoded_token) {
			throw new HttpException(401, "UNAUTHORIZED");
		}

		const { id } = decoded_token as { id: string };

		const user = await UsersModel.findById(id);

		if (!user) {
			throw new HttpException(404, "USER_NOT_FOUND");
		}

		const journey = await JourneyModel.findById(user.journey);
		if (!journey) {
			throw new HttpException(404, "JOURNEY_NOT_FOUND");
		}

		res.locals.user = user;
		res.locals.journey = journey;
		next();
	}

	public async is_admin(req: Request, res: Response, next: NextFunction) {
		const { sudo } = req.body;

		if (sudo !== process.env.SUDO_KEY) {
			throw new HttpException(403, "FORBIDDEN");
		}

		next();
	}
}

const AuthRepositoryImpl = new AuthRepository();

export { AuthRepositoryImpl };
