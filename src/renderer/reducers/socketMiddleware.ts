import { io, Socket } from "socket.io-client";
import { Middleware } from "redux";
import { emitEvent } from "../helpers";
import { RoomUser } from "../interfaces/RoomUser";
import { SettingsState } from "./settingsReducer";
import { RoomState } from "../interfaces/RoomState";

export type SocketAction =
  | {
      type: "SOCKET_CONNECT";
      payload: {
        username: string;
        onComplete: () => void;
        onError: (message: string) => void;
      };
    }
  | {
      type: "SOCKET_TOGGLE_READY";
      payload: {
        onComplete: () => void;
      };
    }
  | {
      type: "SOCKET_UPDATE_CLIPBOARD";
      payload: string;
    }
  | {
      type: "SOCKET_DISCONNECT";
    };

export const createSocketMiddleware = (url: string): Middleware => {
  let connection: Socket | null = null;

  return (storeApi) => (next) => (action: SocketAction) => {
    const dispatch = storeApi.dispatch;

    switch (action.type) {
      case "SOCKET_CONNECT": {
        if (connection !== null) {
          throw new Error("An on-going connection already exists.");
        }

        connection = io(url);
        const username = action.payload.username;

        connection.on("connect", async () => {
          const result = await emitEvent<string>(
            connection,
            "createRoom",
            username
          );

          if (result.status !== "ok") {
            connection.disconnect();
            action.payload.onError(result.failMessage);
            return;
          }

          dispatch({ type: "GAME_ROOM_NAME", payload: result.data });
          dispatch({ type: "GAME_HOSTING", payload: true });
          action.payload.onComplete();
        });

        connection.on("disconnect", () => {
          dispatch({ type: "GAME_RESET" });
          connection = null;
        });

        connection.on("roomStateChange", (roomState: RoomState) => {
          dispatch({ type: "GAME_ROOM_STATE", payload: roomState });
          dispatch({
            type: "GAME_HOST_USER",
            payload: roomState.membersState.find(
              (roomUser) => roomUser.username === username
            ),
          });
        });

        connection.on("roomReady", async () => {
          const settingsState: SettingsState = storeApi.getState().settings;
          const handle = settingsState.selectedWindow;
          const exists = await vnSync.windowExists(handle);

          if (!exists) {
            alert("Window doesn't exist!");
            return;
          }

          await vnSync.initiateInput(handle, settingsState);
        });

        connection.on("connect_error", (error) => {
          console.error(error);
          action.payload.onError("Conncetion error.");
        });

        return;
      }
      case "SOCKET_TOGGLE_READY":
        emitEvent<undefined>(connection, "toggleReady").then((event) => {
          if (event.status !== "ok") {
            console.error(event.failMessage);
            return;
          }

          action.payload.onComplete();
        });

        return;
      case "SOCKET_UPDATE_CLIPBOARD":
        emitEvent<undefined>(
          connection,
          "updateClipboard",
          action.payload
        ).then((event) => {
          if (event.status !== "ok") {
            console.error(event.failMessage);
          }
        });

        return;
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
