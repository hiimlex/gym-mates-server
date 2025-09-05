import { EventEmitter } from "events";
import { BusEventType, IBusEventPayload } from "types/generics";

const eventBus = new EventEmitter();

export function emitBusEvent(
	busEventType: BusEventType,
	payload: IBusEventPayload
) {
	eventBus.emit(busEventType, payload);
}

export function listenBusEvent(
	busEventType: BusEventType,
	listener: (payload: IBusEventPayload) => void
) {
	eventBus.on(busEventType, listener);
}
