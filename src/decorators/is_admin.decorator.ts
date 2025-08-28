import { HttpException } from "@core/http_exception";
import { NextFunction, Request, Response } from "express";

export function IsAdmin(): any {
	return (_: object, __: string, descriptor: PropertyDescriptor) => {
		const originalValue = descriptor.value;

		descriptor.value = async function (
			req: Request,
			res: Response,
			next: NextFunction
		) {
			const { sudo } = req.body;

			if (sudo !== process.env.SUDO_KEY) {
				throw new HttpException(403, "FORBIDDEN");
			}
			return await originalValue.apply(this, [req, res, next]);
		};
	};
}
