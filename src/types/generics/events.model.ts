import { Types } from "mongoose";
import { IUserDocument, MissionContext } from "types/collections";

export enum BusEventType {
	WorkoutCompleted = "workout.completed",
}

export interface IBusEventPayload {
	user: IUserDocument;
	context: MissionContext;
	data?: IBusEventPayloadData;
}

export interface IBusEventPayloadData {
	workout_id?: Types.ObjectId;
}
