import { AnyAction, Dispatch, MiddlewareAPI } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { assertNotNull, assertNull, emitEvent } from "../helpers";
import { RoomState } from "../interfaces/RoomState";
import {
  reset,
  setHosting,
  setHostUser,
  setRoomName,
  setRoomState,
} from "./gameReducer";
import { SettingsState } from "./settingsReducer";
import {
  disconnect,
  ConnectAction,
  ToggleReadyAction,
  UpdateClipboardAction,
} from "./socketActions";
import { EventEmitter } from "events";

let connection: Socket | null = null;

export const connectionEventEmitter = new EventEmitter();

export const socketConnect = (
  url: string,
  storeApi: MiddlewareAPI<Dispatch<AnyAction>>,
  payload: ConnectAction["payload"]
): void => {
  assertNull<Socket>(connection, "connection");

  const dispatch = storeApi.dispatch;
  const username = payload.username;
  let connected = false;

  connection = io(url, {
    reconnection: true,
    reconnectionDelay: 500,
    autoConnect: false,
    reconnectionAttempts: 5,
  });

  connection.io.on("reconnect_attempt", () => {
    assertNotNull<Socket>(connection, "connection");

    console.log(connection.auth);
    console.log("reconnect attempt");

    connectionEventEmitter.emit("reconnectAttempt");
  });

  connection.io.on("reconnect_failed", () => {
    console.log("reconnect failed");

    dispatch(reset());
    dispatch(disconnect());
  });

  connection.io.on("reconnect", () => {
    console.log("reconnect successful");

    connectionEventEmitter.emit("reconnect");
  });

  connection.on("connect", async () => {
    assertNotNull<Socket>(connection, "connection");

    if (connected) {
      return;
    }

    const result = await emitEvent<string>(connection, "createRoom", username);

    if (result.status !== "ok") {
      dispatch(disconnect());
      payload.onError?.(result.failMessage);
      return;
    }

    dispatch(setRoomName(result.data));
    dispatch(setHosting(true));
    payload.onComplete?.();

    connected = true;
  });

  connection.on("disconnect", (reason: string) => {
    if (reason !== "io server disconnect") {
      console.log("reconnecting...?");

      connectionEventEmitter.emit("reconnectAttempt");

      return;
    }

    dispatch(reset());
    dispatch(disconnect());
  });

  connection.on("roomStateChange", (roomState: RoomState) => {
    const hostUser = roomState.membersState.find(
      (roomUser) => roomUser.username === username
    );

    if (!hostUser) {
      throw new Error("Host user not found.");
    }

    dispatch(setRoomState(roomState));
    dispatch(setHostUser(hostUser));
  });

  connection.on("roomReady", async () => {
    const settingsState: SettingsState = storeApi.getState().settings;
    const handle = settingsState.selectedWindow;
    const exists = await vnSync.windowExists(handle);

    if (!exists) {
      alert("Window doesn't exist!");
      return;
    }

    const {
      inputType: type,
      isDoubleClick,
      timeoutBetweenDownAndUp,
      timeoutBetweenActivationAndInput,
    } = settingsState;

    await vnSync.initiateInput(handle, {
      type,
      isDoubleClick,
      timeoutBetweenDownAndUp,
      timeoutBetweenActivationAndInput,
    });
  });

  connection.on("connect_error", (error) => {
    console.error(error);
    payload.onError?.("Conncetion error.");
  });

  connection.on("sessionId", (sessionId: string) => {
    assertNotNull<Socket>(connection, "connection");

    console.log(`Received sessionId: ${sessionId}`);
    connection.auth = {
      sessionId,
    };
  });

  connection.connect();
};

export const socketToggleReady = (
  payload: ToggleReadyAction["payload"]
): void => {
  assertNotNull<Socket>(connection, "connection");

  emitEvent<undefined>(connection, "toggleReady").then((event) => {
    if (event.status !== "ok") {
      console.error(event.failMessage);
      return;
    }

    payload.onComplete?.();
  });
};

export const socketUpdateClipboard = (
  payload: UpdateClipboardAction["payload"]
): void => {
  assertNotNull<Socket>(connection, "connection");

  emitEvent<undefined>(connection, "updateClipboard", payload).then((event) => {
    if (event.status !== "ok") {
      console.error(event.failMessage);
    }
  });
};

export const socketDisconnect = (): void => {
  assertNotNull<Socket>(connection, "connection");

  connection.disconnect();
  connection = null;

  connectionEventEmitter.emit("disconnect");
};
