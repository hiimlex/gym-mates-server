import mongoose, { Mongoose } from "mongoose";
import { add_mongo_transport } from "./logger.config";

import dotenv from "dotenv";
dotenv.config();

export async function connect_database(): Promise<Mongoose | null> {
	try {
		if (mongoose.connection.readyState !== 0) {
			throw new Error("Database is already connected");
		}

		console.log("Connecting to database...", process.env);

		const instance = await mongoose.connect(process.env.DB_URL || "");
		add_mongo_transport();

		return instance;
	} catch (error) {
		console.error("Error connecting to database: ", error);

		return null;
	}
}
