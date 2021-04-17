export interface ConnectionState {
  isConnecting: boolean;
  connected: boolean;
  error: string;
}

export type ConnectionAction =
  | {
      type: "CONNECTION_CONNECTING";
      payload: boolean;
    }
  | {
      type: "CONNECTION_CONNECTED";
      payload: boolean;
    }
  | {
      type: "CONNECTION_ERROR";
      payload: string;
    };

const initialState: ConnectionState = {
  isConnecting: false,
  connected: false,
  error: "",
};

export const connectionReducer = (
  state = initialState,
  action: ConnectionAction
): ConnectionState => {
  switch (action.type) {
    case "CONNECTION_CONNECTING":
      return {
        ...state,
        isConnecting: action.payload,
      };
    case "CONNECTION_CONNECTED":
      return {
        isConnecting: false,
        connected: action.payload,
        error: action.payload ? "" : state.error,
      };
    case "CONNECTION_ERROR":
      return {
        ...state,
        isConnecting: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
