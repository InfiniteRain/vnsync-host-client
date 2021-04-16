export interface InputsState {
  username: string;
}

export type InputsAction = {
  type: "INPUT_USERNAME";
  payload: string;
};

const initialState: InputsState = {
  username: "",
};

export const inputsReducer = (
  state = initialState,
  action: InputsAction
): InputsState => {
  switch (action.type) {
    case "INPUT_USERNAME":
      return {
        ...state,
        username: action.payload,
      };
    default:
      return state;
  }
};
