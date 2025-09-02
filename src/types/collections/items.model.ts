import { ItemSchema } from "@modules/items";
import { Document, InferSchemaType, Model, Types } from "mongoose";
import { IFileDocument, TFile } from "./files.model";
import { AchievementRarity } from "./achievements.model";

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

export enum SkinPiece {
	top = "top",
	bottom = "bottom",
	full = "full",
	boots = "boots",
	hair = "hair",
}

export enum SkinSex {
	male = "male",
	female = "female",
}

export type TSkin = TItem & {
	file?: TFile;
	preview?: TFile;
	piece: SkinPiece;
	sex: SkinSex;
	_id: Types.ObjectId;
	slug: string;
};

export interface IItemDocument extends TItem, Document<Types.ObjectId> {
	_id: Types.ObjectId;
	created_at: Date;
	updated_at: Date;
}

export interface IAchievementDocument extends IItemDocument {
	key: string;
	description: string;
	rarity: AchievementRarity;
}

export interface ITitleDocument extends IItemDocument {
	title: string;
}

export interface IFigureDocument extends IItemDocument {
	file: TFile;
	preview: TFile;
}

export interface ISkinDocument extends IItemDocument {
	file: TFile;
	preview: TFile;
	piece: SkinPiece;
	sex: SkinSex;
}

export interface IItemModel extends Model<IItemDocument> {}
