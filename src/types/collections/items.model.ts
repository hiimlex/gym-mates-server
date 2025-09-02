import { ItemSchema } from "@modules/items";
import { Document, InferSchemaType, Model, Types } from "mongoose";
import { TAchievement } from "./achievements.model";
import { TFile } from "./files.model";
import { TSkin } from "./skins.model";

export enum ItemCategory {
	Title = "title",
	Achievement = "achievement",
	Figure = "figure",
	Badge = "badge",
	Skin = "skin",
	Avatar = "avatar",
}

export const ItemCategoryTc: Record<ItemCategory, string> = {
	[ItemCategory.Title]: "Title",
	[ItemCategory.Achievement]: "Achievement",
	[ItemCategory.Figure]: "Figure",
	[ItemCategory.Badge]: "Badge",
	[ItemCategory.Skin]: "Skin",
	[ItemCategory.Avatar]: "Avatar",
};

export type TItem = InferSchemaType<typeof ItemSchema>;

export interface IItemDocument extends TItem, Document<Types.ObjectId> {
	_id: Types.ObjectId;
	created_at: Date;
	updated_at: Date;
}

export interface IAchievementDocument extends IItemDocument, TAchievement {}

export interface ITitleDocument extends IItemDocument {
	title: string;
}

export interface IFigureDocument extends IItemDocument {
	file: TFile;
	preview: TFile;
}

export interface ISkinDocument extends IItemDocument, TSkin {}

export interface IItemModel extends Model<IItemDocument> {}
