import { timestamps } from "@config/schema.config";
import { FileSchema } from "@modules/files";
import { model, Schema } from "mongoose";
import {
	AchievementKeys,
	AchievementRarity,
	Collections,
	IAchievementDocument,
	IFigureDocument,
	IItemDocument,
	IItemModel,
	ItemCategory,
	ITitleDocument,
	SkinPiece,
	SkinSex,
	SkinSlug,
} from "types/collections";

const ItemSchema = new Schema(
	{
		name: { type: String, required: true },
		category: {
			type: String,
			enum: Object.values(ItemCategory),
			required: true,
		},
		price: { type: Number, required: true },
		requirements: {
			type: [String],
			default: [],
			enum: Object.values(AchievementKeys),
			required: true,
		},
	},
	{
		timestamps,
		versionKey: false,
		collection: Collections.Items,
		_id: true,
		discriminatorKey: "category",
	}
);

const dKey = "category";

ItemSchema.set("discriminatorKey", dKey);

const ItemsModel: IItemModel = model<IItemDocument, IItemModel>(
	Collections.Items,
	ItemSchema,
	Collections.Items
);

const FiguresModel = ItemsModel.discriminator<IFigureDocument>(
	ItemCategory.Figure,
	new Schema(
		{
			file: FileSchema,
			preview: FileSchema,
		},
		{
			versionKey: false,
			timestamps,
		}
	)
);

const BadgesModel = ItemsModel.discriminator<IFigureDocument>(
	ItemCategory.Badge,
	new Schema(
		{
			file: FileSchema,
		},
		{
			versionKey: false,
		}
	)
);

const AvatarsModel = ItemsModel.discriminator<IFigureDocument>(
	ItemCategory.Avatar,
	new Schema(
		{
			file: FileSchema,
		},
		{
			versionKey: false,
		}
	)
);

const SkinsModel = ItemsModel.discriminator<IFigureDocument>(
	ItemCategory.Skin,
	new Schema(
		{
			file: FileSchema,
			preview: FileSchema,
			piece: {
				type: String,
				enum: Object.values(SkinPiece),
				required: true,
			},
			sex: {
				type: String,
				enum: Object.values(SkinSex),
				required: true,
			},
			slug: {
				type: String,
				required: true,
				unique: true,
				enum: Object.values(SkinSlug),
			},
		},
		{
			versionKey: false,
			timestamps,
		}
	)
);

const TitlesModel = ItemsModel.discriminator<ITitleDocument>(
	ItemCategory.Title,
	new Schema(
		{
			title: {
				type: String,
				required: true,
			},
		},
		{ versionKey: false, timestamps }
	)
);

const AchievementsModel = ItemsModel.discriminator<IAchievementDocument>(
	ItemCategory.Achievement,
	new Schema(
		{
			key: {
				type: String,
				enum: Object.values(AchievementKeys),
				unique: true,
				required: true,
			},
			description: {
				type: String,
				required: true,
			},
			rarity: {
				type: String,
				enum: Object.values(AchievementRarity),
				required: true,
			},
			price: {
				type: Number,
				required: false,
			},
			name: {
				type: String,
				required: false,
			},
		},
		{ versionKey: false }
	)
);

export {
	AchievementsModel,
	AvatarsModel,
	BadgesModel,
	FiguresModel,
	ItemSchema,
	ItemsModel,
	SkinsModel,
	TitlesModel,
};
