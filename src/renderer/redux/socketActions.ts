import { createAction } from "@reduxjs/toolkit";

export type ConnectAction = {
  type: "socket/connect";
  payload: {
    username: string;
    onComplete?: () => void;
    onError?: (message: string) => void;
  };
};

export type ToggleReadyAction = {
  type: "socket/toggleReady";
  payload: {
    onComplete?: () => void;
  };
};

export type UpdateClipboardAction = {
  type: "socket/updateClipboard";
  payload: string;
};

export type DisconnectAction = {
  type: "socket/disconnect";
  payload: undefined;
};

export type SocketAction =
  | ConnectAction
  | ToggleReadyAction
  | UpdateClipboardAction
  | DisconnectAction;

const createSocketAction = <T extends SocketAction>(action: T["type"]) =>
  createAction<T["payload"]>(action);

export const connect = createSocketAction<ConnectAction>("socket/connect");
export const toggleReady = createSocketAction<ToggleReadyAction>(
  "socket/toggleReady"
);
export const updateClipboard = createSocketAction<UpdateClipboardAction>(
  "socket/updateClipboard"
);
export const disconnect = createSocketAction<DisconnectAction>(
  "socket/disconnect"
);
