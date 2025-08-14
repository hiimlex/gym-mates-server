import { handle_error } from "@utils/handle_error";
import { Request } from "express";

export default function CatchError(errorCb?: (req: Request) => Promise<void>): any {
	return (_: object, __: string, descriptor: PropertyDescriptor) => {
		const originalValue = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			try {
				return await originalValue.apply(this, args);
			} catch (error) {
				await errorCb?.(args[0]);
				return handle_error(args[1], error);
			}
		};
	};
}
