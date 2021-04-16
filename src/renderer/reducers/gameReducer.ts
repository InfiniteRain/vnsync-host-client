import { RoomUser } from "../interfaces/RoomUser";

export interface GameState {
  isHosting: boolean;
  roomName: string;
  roomState: RoomUser[];
  hostUser: RoomUser | null;
}

export type GameAction =
  | {
      type: "GAME_HOSTING";
      payload: boolean;
    }
  | {
      type: "GAME_ROOM_NAME";
      payload: string;
    }
  | {
      type: "GAME_ROOM_STATE";
      payload: RoomUser[];
    }
  | {
      type: "GAME_HOST_USER";
      payload: RoomUser | null;
    }
  | {
      type: "GAME_RESET";
    };

const initialState: GameState = {
  isHosting: false,
  roomName: "",
  roomState: [],
  hostUser: null,
};

export const gameReducer = (
  state = initialState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "GAME_HOSTING":
      return {
        ...state,
        isHosting: action.payload,
      };
    case "GAME_ROOM_NAME":
      return {
        ...state,
        roomName: action.payload,
      };
    case "GAME_ROOM_STATE":
      return {
        ...state,
        roomState: action.payload,
      };
    case "GAME_HOST_USER":
      return {
        ...state,
        hostUser: action.payload,
      };
    case "GAME_RESET":
      return initialState;
    default:
      return state;
  }
};
