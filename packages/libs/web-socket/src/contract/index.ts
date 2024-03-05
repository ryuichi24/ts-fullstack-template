export type EventName = string;

export type EventPayload = any;

export type EventHandler = (payload?: EventPayload) => void;

export type MessageData = { eventName: EventName; payload: EventPayload };
