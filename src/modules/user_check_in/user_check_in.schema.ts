import { timestamps } from "@config/schema.config";
import { model, Model, Schema } from "mongoose";
import { Collections } from "types/collections";
import { IUserCheckInDocument } from "types/collections/user_check_in.model";

const UserCheckInSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: Collections.Users,
			required: true,
		},
		last_streak_check: {
			type: Date,
			required: false,
		},
	},
	{ versionKey: false, timestamps, collection: Collections.UserCheckIns }
);

const UserCheckInModel = model<IUserCheckInDocument>(
	Collections.UserCheckIns,
	UserCheckInSchema,
);

export { UserCheckInSchema, UserCheckInModel };
