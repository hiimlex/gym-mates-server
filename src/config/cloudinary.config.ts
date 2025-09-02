const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
import dotenv from "dotenv";
import { Request } from "express";
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryDestroy: (
	name: string,
	cb?: () => void | Promise<void>
) => Promise<void> = cloudinary.uploader.destroy;

export const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "gym-mates",
		allowedFormats: ["jpg", "png", "jpeg", "svg", "gif"],
		// this will use the original file name as the public_id
		public_id: (_: Request, file: Express.Multer.File) => {
			return file.originalname.split(".")[0];
		},
	},
});
