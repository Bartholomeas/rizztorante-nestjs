import type { EventPayloads } from "./events.types";

export const createEvent = <T extends keyof EventPayloads>(type: T) => {
  return (payload: EventPayloads[T]) => {
    return [type, payload] as const;
  };
};
