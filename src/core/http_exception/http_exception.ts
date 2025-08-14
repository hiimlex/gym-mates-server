import { SystemErrors, TSystemErrors } from "types/generics";

export class HttpException extends Error {
	message!: string;
	status: number;
	content?: Record<string, any>;

	constructor(status: number, message: TSystemErrors, content?: Record<string, any>) {
		super();

		if (SystemErrors[message]) {
			super.message = SystemErrors[message];
		}

		this.message = message.toString();
		this.status = status;
		this.content = content;
	}
}
