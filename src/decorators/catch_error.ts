import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";

export function CatchError(errorCb?: (req: Request, res: Response) => Promise<void>): any {
	return (_: object, __: string, descriptor: PropertyDescriptor) => {
		const originalValue = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			try {
				return await originalValue.apply(this, args);
			} catch (error) {
				await errorCb?.(args[0], args[1]);
				return handle_error(args[1], error);
			}
		};
	};
}
