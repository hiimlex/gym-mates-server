import { upload, upload_key } from "@middlewares/upload.middleware";
import { destroyCloudinaryFileOnError } from "@utils/destroyCloudinaryFileOnError";
import { handle_error } from "@utils/handle_error";
import { Request, Response, NextFunction } from "express";

function runMulter(
	req: Request,
	res: Response,
	field: string,
	multiple: boolean
): Promise<void> {
	return new Promise((resolve, reject) => {
		const middleware = multiple
			? upload.array(field) // multiple files
			: upload.single(field); // single file

		middleware(req, res, (err: any) => {
			if (err) return reject(err);
			resolve();
		});
	});
}

export function Upload(
	{ multiple, field }: { multiple?: boolean; field?: string } = {
		multiple: false,
		field: upload_key,
	}
) {
	return (_: object, __: string, descriptor: PropertyDescriptor) => {
		const originalValue = descriptor.value;

		descriptor.value = async function (
			req: Request,
			res: Response,
			next: NextFunction
		) {
			try {
				const defaultField = field || upload_key;
				// Run multer depending on single vs multiple
				await runMulter(req, res, defaultField, !!multiple);

				// Call original controller method
				return await originalValue.apply(this, [req, res, next]);
			} catch (error) {
				// Cleanup uploaded file(s) if error occurs
				await destroyCloudinaryFileOnError(req);
				return handle_error(res, error);
			}
		};
	};
}
