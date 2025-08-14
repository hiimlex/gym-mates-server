import { composeWithMongoose } from "graphql-compose-mongoose";
import { model, Schema } from "mongoose";
import {
	Collections,
	IHealthyDocument,
	IHealthyModel,
} from "types/collections";

const HealthySchema = new Schema(
	{
		weight: {
			type: Number,
			required: true,
		},
		height: {
			type: Number,
			required: true,
		},
		body_fat: {
			type: Number,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: Collections.Users,
			required: true,
			unique: true,
		}
	},
	{ versionKey: false, timestamps: true, collection: Collections.HealthyInfo }
);

const HealthyModel: IHealthyModel = model<IHealthyDocument, IHealthyModel>(
	Collections.HealthyInfo,
	HealthySchema,
	Collections.HealthyInfo
);

export { HealthySchema, HealthyModel };
