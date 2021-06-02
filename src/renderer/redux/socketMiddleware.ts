import { Middleware } from "redux";
import { SocketAction } from "./socketActions";
import {
  socketConnect,
  socketDisconnect,
  socketToggleReady,
  socketUpdateClipboard,
} from "./socketLogic";

export const createSocketMiddleware = (url: string): Middleware => {
  return (storeApi) => (next) => (action: SocketAction) => {
    switch (action.type) {
      case "socket/connect":
        socketConnect(url, storeApi, action.payload);
        return;
      case "socket/toggleReady":
        socketToggleReady(action.payload);
        return;
      case "socket/updateClipboard":
        socketUpdateClipboard(action.payload);
        return;
      case "socket/disconnect":
        socketDisconnect();
        return;
      default:
        return next(action);
    }
  };
};
