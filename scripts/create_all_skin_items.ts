import mongoose from "mongoose";
import { AllSkins } from "../data";
import { SkinsModel } from "../src/modules/items";
import fs from "fs";
import path from "path";
import { TFile } from "../src/types/collections";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadFile(filePath: string, folder: string, slug: string) {
	try {
		const result = await cloudinary.uploader.upload(filePath, {
			folder,
			resource_type: "auto", // auto detects png/svg/etc
			public_id: slug,
		});

		return { public_id: result.public_id, url: result.secure_url };
	} catch (err) {
		console.error("Cloudinary upload failed:", err);
		return null;
	}
}

async function create_all_skin_items() {
	try {
		const url =
			process.env.NODE_ENV === "production"
				? process.env.PROD_DB_URL
				: process.env.DB_URL;

		if (!url) throw new Error("Database URL not provided");

		await mongoose.connect(url);

		for (const skin of AllSkins) {
			// Build file paths based on a slug or ID
			const baseName = skin.slug;
			// Assuming images are stored in a local 'images' directory
			const filePath = path.resolve(__dirname, `../images/${baseName}.svg`);
			const previewPath = path.resolve(
				__dirname,
				`../images/${baseName}_preview.png`
			);

			let file: TFile | null = null;
			let preview: TFile | null = null;
			// Check if files exist before uploading
			if (fs.existsSync(filePath)) {
				file = await uploadFile(filePath, "gym-mates/skins", baseName);
			}

			if (fs.existsSync(previewPath)) {
				preview = await uploadFile(
					previewPath,
					"gym-mates/previews",
					`${baseName}_preview`
				);
			}
			// Insert into MongoDB with file references
			const createdFile = await SkinsModel.create({ ...skin, file, preview });
			// If insertion fails, optionally delete uploaded files to avoid orphaned files
			if (!createdFile) {
				console.error(`❌ Failed to insert skin: ${skin.name}`);
				if (file && file.public_id) {
					await cloudinary.uploader.destroy(file?.public_id);
				}
				if (preview && preview.public_id) {
					await cloudinary.uploader.destroy(preview?.public_id);
				}
				continue;
			}

			console.log(`✅ Inserted skin: ${skin.name}`);
		}

		console.log("🎉 All skins inserted with images!");
		await mongoose.disconnect();
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

create_all_skin_items();
