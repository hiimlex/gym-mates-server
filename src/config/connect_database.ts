import mongoose, { Mongoose } from "mongoose";
import { add_mongo_transport } from "./logger.config";

export async function connect_database(): Promise<Mongoose | null> {
	try {
		if (mongoose.connection.readyState !== 0) {
			throw new Error("Database is already connected");
		}

		const instance = await mongoose.connect(process.env.DB_URL || "");
		add_mongo_transport();

		return instance;
	} catch (error) {
		console.error("Error connecting to database: ", error);

		return null;
	}
}
