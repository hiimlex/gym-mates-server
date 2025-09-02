import mongoose from "mongoose";
import { AllSkins } from "../db";
import { SkinsModel } from "../modules/items";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function delete_all_skin_items() {
	try {
		const url =
			process.env.NODE_ENV === "production"
				? process.env.PROD_DB_URL
				: process.env.DB_URL;

		if (!url) throw new Error("Database URL not provided");

		await mongoose.connect(url);

		for (const skin of AllSkins) {
			const skinDocument = await (SkinsModel as any).findById(skin._id);

			if (!skinDocument) {
				console.log(`Skin with ID ${skin._id} not found.`);
				continue;
			}

			if (skinDocument.file && skinDocument.file.public_id) {
				await cloudinary.uploader.destroy(skinDocument.file.public_id);
			}

			if (skinDocument.preview && skinDocument.preview.public_id) {
				await cloudinary.uploader.destroy(skinDocument.file.public_id);
			}

			await skinDocument.deleteOne();
		}

		console.log("All skin items have been deleted successfully.");
		await mongoose.disconnect();

		return;
	} catch (error) {
		console.error("Error connecting to the database:", error);
		return;
	}
}

delete_all_skin_items();
