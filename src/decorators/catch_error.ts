import { logger } from "@config/logger.config";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";

export function CatchError(
	errorCb?: (req: Request, res: Response) => Promise<void>
): any {
	return (_: object, __: string, descriptor: PropertyDescriptor) => {
		const originalValue = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			try {
				return await originalValue.apply(this, args);
			} catch (error) {
				const req = args[0] as Request | undefined;
				const res = args[1] as Response | undefined;

				// custom callback if provided
				if (req && res && errorCb) {
					await errorCb?.(req, res);
				}

				if (res && typeof res.status === "function") {
					// Express route
					return handle_error(res, error);
				} else {
					// Non-HTTP context (e.g. cron, event bus)
					logger.error("Unhandled error in non-HTTP context:", error);
					// Decide: either swallow or rethrow
					return null;
				}
			}
		};
	};
}
