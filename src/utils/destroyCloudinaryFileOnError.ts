import { cloudinaryDestroy } from "@config/cloudinary.config";
import { Request } from "express";
import { TUploadedFile } from "types/collections";

export const destroyCloudinaryFileOnError = async (req: Request) => {
	if (req.file) {
		const file = req.file as TUploadedFile;
		if (file) {
			await cloudinaryDestroy(file.filename);
		}
	}
};
