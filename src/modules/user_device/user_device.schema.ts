import { timestamps } from "@config/schema.config";
import mongoose, { Schema } from "mongoose";
import {
	Collections,
	IUserDeviceDocument,
	IUserDeviceModel,
	TUserDevice,
} from "types/collections";

const UserDeviceSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		deviceInfo: {
			os: { type: String, required: true },
			model: { type: String, required: true },
		},
		pushToken: { type: String, required: true },
		lastActive: { type: Date, required: false },
	},
	{ versionKey: false, timestamps, collection: Collections.UserDevices }
);

const UserDeviceModel = mongoose.model<IUserDeviceDocument, IUserDeviceModel>(
	Collections.UserDevices,
	UserDeviceSchema,
	Collections.UserDevices
);

export { UserDeviceSchema, UserDeviceModel };
