import { io, Socket } from "socket.io-client";
import { Middleware } from "redux";
import { emitEvent } from "../helpers";
import { CombinedState } from ".";
import { RoomUser } from "../interfaces/RoomUser";

export type SocketAction =
  | {
      type: "SOCKET_CONNECT";
      payload: string;
    }
  | {
      type: "SOCKET_DISCONNECT";
    };

export const createSocketMiddleware = (url: string): Middleware => {
  let connection: Socket | null = null;

  return (storeApi) => (next) => (action: SocketAction) => {
    const state: CombinedState = storeApi.getState();
    const dispatch = storeApi.dispatch;

    switch (action.type) {
      case "SOCKET_CONNECT": {
        if (connection !== null) {
          throw new Error("An on-going connection already exists.");
        }

        dispatch({ type: "CONNECTION_CONNECTING", payload: true });

        connection = io(url);
        const username = action.payload;

        connection.on("connect", async () => {
          const result = await emitEvent<string>(
            connection,
            "createRoom",
            username
          );

          if (result.status !== "ok") {
            dispatch({
              type: "CONNECTION_ERROR",
              payload: result.failMessage,
            });
            connection.disconnect();
            return;
          }

          dispatch({ type: "GAME_ROOM_NAME", payload: result.data });
          dispatch({ type: "GAME_HOSTING", payload: true });
          dispatch({ type: "CONNECTION_CONNECTED", payload: true });
        });

        connection.on("disconnect", () => {
          dispatch({ type: "GAME_RESET" });
          dispatch({ type: "CONNECTION_CONNECTED", payload: false });
          connection = null;
        });

        connection.on("roomStateChange", (roomState: RoomUser[]) => {
          dispatch({ type: "GAME_ROOM_STATE", payload: roomState });
          dispatch({
            type: "GAME_HOST_USER",
            payload: roomState.find(
              (roomUser) => roomUser.username === username
            ),
          });
        });

        connection.on("roomReady", async () => {
          const handle = state.settings.selectedWindow;
          const exists = await vnSync.windowExists(handle);

          if (!exists) {
            alert("Window doesn't exist!");
            return;
          }

          await vnSync.initiateInput(handle, state.settings);
        });

        connection.on("connect_error", (error) => {
          console.error(error);

          dispatch({
            type: "CONNECTION_ERROR",
            payload: error.message,
          });
        });

        return;
      }
      case "SOCKET_DISCONNECT":
        if (connection === null) {
          throw new Error("An on-going connection doesn't exist.");
        }

        connection.disconnect();

        return;
      default:
        return next(action);
    }
  };
};
