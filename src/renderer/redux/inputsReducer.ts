import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InputsState {
  username: string;
}

const initialState: InputsState = {
  username: "",
};

export const inputsSlice = createSlice({
  name: "inputs",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { setUsername } = inputsSlice.actions;

export const inputsReducer = inputsSlice.reducer;
