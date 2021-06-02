import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  selectedWindow: number;
  inputType: "leftMouseClick" | "enterKeyPress";
  isDoubleClick: boolean;
  timeoutBetweenDownAndUp: number;
  timeoutBetweenActivationAndInput: number;
}

const initialState: SettingsState = {
  selectedWindow: 0,
  inputType: "enterKeyPress",
  isDoubleClick: false,
  timeoutBetweenDownAndUp: 100,
  timeoutBetweenActivationAndInput: 300,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSelectedWindow: (state, action: PayloadAction<number>) => {
      state.selectedWindow = action.payload;
    },
    setInputType: (
      state,
      action: PayloadAction<"enterKeyPress" | "leftMouseClick">
    ) => {
      state.inputType = action.payload;
    },
    setDoubleClick: (state, action: PayloadAction<boolean>) => {
      state.isDoubleClick = action.payload;
    },
    setTimeoutBdau: (state, action: PayloadAction<number>) => {
      state.timeoutBetweenDownAndUp = action.payload;
    },
    setTimeoutBaai: (state, action: PayloadAction<number>) => {
      state.timeoutBetweenActivationAndInput = action.payload;
    },
  },
});

export const {
  setSelectedWindow,
  setInputType,
  setDoubleClick,
  setTimeoutBdau,
  setTimeoutBaai,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
