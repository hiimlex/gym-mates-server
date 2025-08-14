import { FileSchema } from "@modules/files";
import { Document, InferSchemaType, Model, Types } from "mongoose";

export type TFile = InferSchemaType<typeof FileSchema>;

export type TUploadedFile = {
	fieldname: string; // file
	originalname: string; // myPicture.png
	encoding: string; // 7bit
	mimetype: string; // image/png
	destination: string; // ./public/uploads
	filename: string; // 1571575008566-myPicture.png
	path: string; // public/uploads/1571575008566-myPicture.png
	size: number; // 1255
};

export interface IFileDocument extends TFile, Document<Types.ObjectId> {}

export interface IFileModel extends Model<IFileDocument> {}