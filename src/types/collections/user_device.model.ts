import { UserDeviceSchema } from "@modules/user_device";
import { Document, InferSchemaType, Model } from "mongoose";

export type TUserDevice = InferSchemaType<typeof UserDeviceSchema>;

export interface IUserDeviceDocument extends Document, TUserDevice {}

export interface IUserDeviceModel extends Model<IUserDeviceDocument> {}