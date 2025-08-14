import { logger } from "@config/logger.config";
import { HttpException } from "@core/http_exception";
import { Response } from "express";

export function handle_error(res: Response, error: any): Response {
	const message: string = error.message || "";

	if (error instanceof HttpException) {
		logger.error(`ERROR: ${error.status}] ${error.message}`);
		return res.status(error.status).json({ message, content: error.content });
	}

	logger.error(
		`ERROR: ${message}`,
	);

	return res.status(400).json({ message });
}
