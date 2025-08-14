import { timestamps } from "@config/schema.config";
import { FileSchema } from "@modules/files";
import { model, Schema, Types } from "mongoose";
import {
	Collections,
	CrewStreak,
	CrewVisibility,
	ICrewDocument,
	ICrewsModel,
} from "types/collections";

const CrewRulesSchema = new Schema(
	{
		gym_focused: { type: Boolean, default: false, required: false },
		pay_on_past: { type: Boolean, default: true, required: false },
		pay_without_picture: { type: Boolean, default: true, required: false },
		show_members_rank: { type: Boolean, default: true, required: false },
		free_weekends: { type: Boolean, default: true, required: false },
	},
	{ versionKey: false, _id: false }
);

const MemberSchema = new Schema(
	{
		user: {
			type: Types.ObjectId,
			ref: Collections.Users,
			required: true,
		},
		is_admin: {
			type: Boolean,
			default: false,
			required: false,
		},
		joined_at: {
			type: Date,
			default: Date.now,
			required: false,
		},
	},
	{ versionKey: false }
);

const CrewsSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		code: {
			type: String,
			required: true,
			unique: true,
		},
		members: {
			type: [MemberSchema],
			required: true,
			default: [],
		},
		white_list: {
			type: [Types.ObjectId],
			ref: Collections.Users,
			default: [],
		},
		created_by: {
			type: Types.ObjectId,
			ref: Collections.Users,
			required: true,
			unique: true,
		},
		visibility: {
			type: String,
			enum: Object.values(CrewVisibility),
			default: CrewVisibility.Public,
		},
		banner: {
			type: FileSchema,
			required: false,
		},
		rules: {
			type: CrewRulesSchema,
			required: false,
			default: {
				gym_focused: false,
				paid_at_anytime: true,
				paid_without_picture: true,
				show_members_rank: true,
				free_weekends: true,
			},
		},
		streak: {
			type: [String],
			enum: Object.values(CrewStreak),
			default: [CrewStreak.Weekly, CrewStreak.Monthly],
		},
		lose_streak_in_days: {
			type: Number,
			default: 2,
			required: false,
		},
	},
	{ versionKey: false, timestamps }
);

CrewsSchema.methods.populate_members = async function () {
	await this.populate({
		path: "members",
		select: "name email avatar coins",
	});
};

const CrewsModel: ICrewsModel = model<ICrewDocument, ICrewsModel>(
	Collections.Crews,
	CrewsSchema,
	Collections.Crews
);

export { CrewRulesSchema, CrewsModel, CrewsSchema, MemberSchema };
