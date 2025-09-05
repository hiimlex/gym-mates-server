import { listenBusEvent } from "@config/events.config";
import { BusEventType } from "types/generics";
import { MissionsRepositoryImpl } from "./missions.repository";

export const register_workout_missions_listener = () => {
	listenBusEvent(
		BusEventType.WorkoutCompleted,
		MissionsRepositoryImpl.on_event
	);
};
