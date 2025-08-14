import { Document, InferSchemaType, Model, Types } from "mongoose";
import { WorkoutSchema } from "@modules/workouts";

export enum WorkoutType {
	Gym = "gym",
	Aerobics = "aerobics",
	Cardio = "cardio",
	CrossFit = "cross_fit",
	Running = "running",
	Cycling = "cycling",
	Swimming = "swimming",
	Yoga = "yoga",
	Other = "other",
}

export type TWorkout = InferSchemaType<typeof WorkoutSchema>;

export interface IWorkoutDocument extends Document<Types.ObjectId>, TWorkout {}

export interface IWorkoutsModel extends Model<IWorkoutDocument> {}
