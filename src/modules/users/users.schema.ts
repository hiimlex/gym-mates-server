import { timestamps } from "@config/schema.config";
import { HttpException } from "@core/http_exception";
import { model, Schema, Types } from "mongoose";
import {
	Collections,
	IUserDocument,
	IUsersModel,
	TJourneyEvent,
} from "types/collections";
import { JourneyModel } from "../journey";
import { FileSchema } from "@modules/files";

const UsersSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		access_token: { type: String, required: false },
		avatar: { type: FileSchema, required: false },
		character: { type: String, required: false },
		coins: { type: Number, default: 0, required: true },
		title: {
			type: Types.ObjectId,
			ref: Collections.Items,
			required: false,
		},
		journey: {
			type: Types.ObjectId,
			ref: Collections.Journeys,
			required: false,
		},
		healthy: {
			type: Types.ObjectId,
			red: Collections.HealthyInfo,
			required: false,
		},
		following: {
			type: [Types.ObjectId],
			ref: Collections.Users,
			required: false,
		},
		followers: {
			type: [Types.ObjectId],
			ref: Collections.Users,
			required: false,
		},
		favorites: {
			type: [Types.ObjectId],
			ref: Collections.Crews,
			required: false,
		},
		day_streak: {
			type: Number,
			default: 0,
			required: false,
		},
		created_at: {
			type: Date,
			default: Date.now,
			required: true,
		},
	},
	{ versionKey: false, timestamps, collection: Collections.Users }
);

UsersSchema.methods.add_journey_event = async function (event: TJourneyEvent) {
	const user = this as IUserDocument;

	// Ensure the user has a journey
	if (!user.journey) {
		throw new HttpException(404, "JOURNEY_NOT_FOUND");
	}

	const user_journey = await JourneyModel.findById(user.journey);

	if (!user_journey) {
		throw new HttpException(404, "JOURNEY_NOT_FOUND");
	}

	await user_journey.updateOne({
		$push: { events: event },
	});
};

UsersSchema.methods.add_workout = async function (workout_id: Types.ObjectId) {
	const user = this as IUserDocument;

	// Ensure the user has a journey
	if (!user.journey) {
		throw new HttpException(404, "JOURNEY_NOT_FOUND");
	}

	const user_journey = await JourneyModel.findById(user.journey);

	if (!user_journey) {
		throw new HttpException(404, "JOURNEY_NOT_FOUND");
	}

	await user_journey.updateOne({
		$push: { workouts: workout_id },
	});
};

UsersSchema.methods.add_item_to_inventory = async function (
	item_id: Types.ObjectId
) {
	const user = this as IUserDocument;

	// Ensure the user has a journey
	if (!user.journey) {
		throw new HttpException(404, "JOURNEY_NOT_FOUND");
	}

	const user_journey = await JourneyModel.findById(user.journey);

	if (!user_journey) {
		throw new HttpException(404, "JOURNEY_NOT_FOUND");
	}

	await user_journey.updateOne({
		$push: { inventory: item_id },
	});
};

UsersSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	// Remove the password field from the user object
	delete userObject.password;
	delete userObject.access_token;

	return userObject;
};

const UsersModel: IUsersModel = model<IUserDocument, IUsersModel>(
	Collections.Users,
	UsersSchema,
	Collections.Users
);

export { UsersModel, UsersSchema };
