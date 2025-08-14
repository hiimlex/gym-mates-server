import { logger } from "@config/logger.config";
import { handle_error } from "@utils/handle_error";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export function validate_schema(validator: Joi.ObjectSchema) {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = validator.validate(req.body);
		if (error) {
			return handle_error(res, error);
		}
		next();
	};
}
