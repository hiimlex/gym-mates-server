import { HealthySchema } from "@modules/healthy";
import { Document, InferSchemaType, Model } from "mongoose";

export type THealthy = InferSchemaType<typeof HealthySchema>

export interface IHealthyDocument extends THealthy, Document {
}

export interface IHealthyModel extends Model<IHealthyDocument> {}