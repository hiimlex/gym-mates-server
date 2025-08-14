const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
import dotenv from "dotenv";
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
	},
});
