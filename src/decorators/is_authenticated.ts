import { HttpException } from "@core/http_exception";
import { AuthRepositoryImpl } from "@modules/auth";
import { JourneyModel } from "@modules/journey";
import { UsersModel } from "@modules/users";
import { NextFunction, Request, Response } from "express";
import { decode } from "jsonwebtoken";

export function IsAuthenticated(): any {
	return (_: object, __: string, descriptor: PropertyDescriptor) => {
		const originalValue = descriptor.value;

		descriptor.value = async function (
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

			return await originalValue.apply(this, [req, res, next]);
		};
	};
}
