import { UsersSchema } from "@modules/users";
import { Document, InferSchemaType, Model, Types } from "mongoose";
import { TJourneyEvent } from "./journey.model";
import { TCrew } from "./crews.model";

export type TUser = InferSchemaType<typeof UsersSchema> & {
	_id: Types.ObjectId;
};

export interface IUserDocument extends Document<Types.ObjectId>, TUser {
	add_journey_event: (event: TJourneyEvent) => Promise<void>;
	add_workout: (workout_id: Types.ObjectId) => Promise<void>;
	add_item_to_inventory: (item_id: Types.ObjectId) => Promise<void>;
}

export interface IUsersModel extends Model<IUserDocument> {}

export interface IUserFollowerInfo {
	user: TUser;
	in_crews?: TCrew[];
	is_mutual?: boolean;
}
