export interface SettingsState {
  selectedWindow: number;
  type: "leftMouseClick" | "enterKeyPress";
  isDoubleClick: boolean;
  timeoutBetweenDownAndUp: number;
  timeoutBetweenActivationAndInput: number;
}

export type SettingsAction =
  | {
      type: "SETTING_SELECTED_WINDOW";
      payload: number;
    }
  | {
      type: "SETTING_INPUT_TYPE";
      payload: "enterKeyPress" | "leftMouseClick";
    }
  | {
      type: "SETTING_DOUBLE_CLICK";
      payload: boolean;
    }
  | {
      type: "SETTING_TIMEOUT_BDAU";
      payload: number;
    }
  | {
      type: "SETTING_TIMEOUT_BAAI";
      payload: number;
    };

const initialState: SettingsState = {
  selectedWindow: 0,
  type: "enterKeyPress",
  isDoubleClick: false,
  timeoutBetweenDownAndUp: 100,
  timeoutBetweenActivationAndInput: 300,
};

export const settingsReducer = (
  state = initialState,
  action: SettingsAction
): SettingsState => {
  switch (action.type) {
    case "SETTING_SELECTED_WINDOW":
      return {
        ...state,
        selectedWindow: action.payload,
      };
    case "SETTING_INPUT_TYPE":
      return {
        ...state,
        type: action.payload,
      };
    case "SETTING_DOUBLE_CLICK":
      return {
        ...state,
        isDoubleClick: action.payload,
      };
    case "SETTING_TIMEOUT_BDAU":
      return {
        ...state,
        timeoutBetweenDownAndUp: action.payload,
      };
    case "SETTING_TIMEOUT_BAAI":
      return {
        ...state,
        timeoutBetweenActivationAndInput: action.payload,
      };
    default:
      return state;
  }
};
