import { timestamps } from "@config/schema.config";
import { FileSchema } from "@modules/files";
import Joi from "joi";
import { model, Schema, Types } from "mongoose";
import {
	Collections,
	IWorkoutDocument,
	IWorkoutsModel,
	WorkoutType,
} from "types/collections";

const WorkoutSchema = new Schema(
	{
		user: {
			type: Types.ObjectId,
			ref: Collections.Users,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		picture: {
			type: FileSchema,
			required: false,
		},
		date: {
			type: Date,
			required: true,
		},
		type: {
			type: String,
			enum: Object.values(WorkoutType),
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		shared_to: {
			type: [Types.ObjectId],
			ref: Collections.Crews,
			required: true,
		},
		earned: {
			type: Number,
			default: 0,
			required: false,
		},
		receipt: {
			type: Map,
			of: Number,
			default: {},
			required: false,
		},
	},
	{ versionKey: false, timestamps, collection: Collections.Workouts }
);

const WorkoutsModel: IWorkoutsModel = model<IWorkoutDocument, IWorkoutsModel>(
	Collections.Workouts,
	WorkoutSchema,
	Collections.Workouts
);

export { WorkoutSchema, WorkoutsModel };
