import { timestamps } from "@config/schema.config";
import { model, Schema, Types } from "mongoose";
import { AchievementKeys, Collections, IMissionDocument } from "types/collections";

const MissionSchema = new Schema(
	{
		achievement: {
			type: Schema.Types.ObjectId,
			ref: Collections.Items,
			required: true,
		},
		hidden: {
			type: Boolean,
			default: false,
			required: false,
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		reward: {
			type: Number,
			required: true,
			default: 0,
		},
		requirements: {
			type: [String],
			required: false,
			enum: Object.values(AchievementKeys),
			default: [],
		},
		unlocks: {
			type: [Types.ObjectId],
			ref: Collections.Items,
			default: [],
			required: false,
		},
		// repeatable: {
		// 	type: Boolean,
		// 	default: false,
		// 	required: false,
		// },
	},
	{ versionKey: false, timestamps, collection: Collections.Missions }
);

const MissionsModel = model<IMissionDocument>(Collections.Missions, MissionSchema);

export { MissionSchema, MissionsModel };