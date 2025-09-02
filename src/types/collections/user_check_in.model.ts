import { UserCheckInSchema } from "@modules/user_check_in";
import { Document, InferSchemaType } from "mongoose";

export type TUserCheckIn = InferSchemaType<typeof UserCheckInSchema>;

export interface IUserCheckInDocument extends TUserCheckIn, Document {}
