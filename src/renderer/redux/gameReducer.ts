import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RoomState } from "../interfaces/RoomState";
import { RoomUser } from "../interfaces/RoomUser";

export interface GameState {
  isHosting: boolean;
  roomName: string;
  roomState: RoomState;
  hostUser: RoomUser | null;
}

const initialState: GameState = {
  isHosting: false,
  roomName: "",
  roomState: {
    clipboard: [],
    membersState: [],
  },
  hostUser: null,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setHosting: (state, action: PayloadAction<boolean>) => {
      state.isHosting = action.payload;
    },
    setRoomName: (state, action: PayloadAction<string>) => {
      state.roomName = action.payload;
    },
    setRoomState: (state, action: PayloadAction<RoomState>) => {
      state.roomState = action.payload;
    },
    setHostUser: (state, action: PayloadAction<RoomUser | null>) => {
      state.hostUser = action.payload;
    },
    reset: (state) => {
      state.isHosting = false;
      state.roomName = "";
      state.roomState = initialState.roomState;
      state.hostUser = null;
    },
  },
});

export const {
  setHosting,
  setRoomName,
  setRoomState,
  setHostUser,
  reset,
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;
