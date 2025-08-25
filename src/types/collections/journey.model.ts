import { Document, InferSchemaType, Model, Types } from "mongoose";
import { EventSchema, JourneySchema } from "@modules/journey";

export enum JourneyEventAction {
	ADD = "add",
	REMOVE = "remove",
	UPDATE = "update",
	BUY = "buy",
	ACHIEVE = "achieve",
	JOIN = "join",
	LEAVE = "leave",
	PAID = "paid",
	LOSE_STREAK = "lose_streak",
	START = "start",
	FOLLOW = "follow",
}

export enum JourneyEventSchemaType {
	Healthy = "healthy",
	Workout = "workout",
	Item = "item",
	Friend = "friend",
	Crew = "crew",
	User = "user",
}

export type TJourney = InferSchemaType<typeof JourneySchema>;
export type TJourneyEvent = InferSchemaType<typeof EventSchema> & {
	_id: Types.ObjectId;
	created_at: Date;
};

export interface IJourneyDocument extends TJourney, Document {}

export interface IJourneyModel extends Model<IJourneyDocument> {}
