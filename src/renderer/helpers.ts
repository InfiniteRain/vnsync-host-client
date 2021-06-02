import { Socket } from "socket.io-client";
import { FailedResult } from "./interfaces/FailResult";
import { SuccessResult } from "./interfaces/SuccessResult";

export const emitEvent = async <T = undefined>(
  socket: Socket,
  eventName: string,
  ...args: unknown[]
): Promise<FailedResult | SuccessResult<T>> => {
  return new Promise((resolve) => {
    socket.emit(eventName, ...args, (data: FailedResult | SuccessResult<T>) => {
      resolve(data);
    });
  });
};

export const sleep = async (time: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, time));
};

export function assertNull<T>(
  value: T | null,
  name: string
): asserts value is null {
  if (value !== null) {
    throw new Error(`Value of "${name}" is not null.`);
  }
}

export function assertNotNull<T>(
  value: T | null,
  name: string
): asserts value is T {
  if (value === null) {
    throw new Error(`Value of "${name}" is null.`);
  }
}
