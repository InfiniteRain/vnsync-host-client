import { State } from "./interfaces/State";

/*/*
  const [inputSettings, setInputSettings] = useState<InputSettings>({
    type: "enterKeyPress",
    isDoubleClick: false,
    timeoutBetweenDownAndUp: 100,
    timeoutBetweenActivationAndInput: 300,
  });*/

export type Action =
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

const initialState: State = {
  settings: {
    type: "enterKeyPress",
    isDoubleClick: false,
    timeoutBetweenDownAndUp: 100,
    timeoutBetweenActivationAndInput: 300,
  },
};

export const rootReducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case "SETTING_INPUT_TYPE":
      return {
        ...state,
        settings: {
          ...state.settings,
          type: action.payload,
        },
      };
    case "SETTING_DOUBLE_CLICK":
      return {
        ...state,
        settings: {
          ...state.settings,
          isDoubleClick: action.payload,
        },
      };
    case "SETTING_TIMEOUT_BDAU":
      return {
        ...state,
        settings: {
          ...state.settings,
          timeoutBetweenDownAndUp: action.payload,
        },
      };
    case "SETTING_TIMEOUT_BAAI":
      return {
        ...state,
        settings: {
          ...state.settings,
          timeoutBetweenActivationAndInput: action.payload,
        },
      };
    default:
      return state;
  }
};
