import { timestamps } from "@config/schema.config";
import { Schema } from "mongoose";

const FileSchema = new Schema(
	{
		url: String,
		public_id: {
			type: String,
		},
	},
	{ versionKey: false, timestamps, _id: false }
);

export { FileSchema };
