import { timestamps } from "@config/schema.config";
import { model, Schema } from "mongoose";
import { Collections, IFileDocument, IFileModel } from "types/collections";

const FileSchema = new Schema(
	{
		url: String,
		public_id: {
			type: String,
		},
	},
	{ versionKey: false, timestamps }
);

export { FileSchema };
