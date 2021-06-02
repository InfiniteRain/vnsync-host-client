import { configureStore } from "@reduxjs/toolkit";
import { gameReducer } from "./gameReducer";
import { inputsReducer } from "./inputsReducer";
import { settingsReducer } from "./settingsReducer";
import { createSocketMiddleware } from "./socketMiddleware";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    inputs: inputsReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["payload.onComplete", "payload.onError"],
      },
    }).concat(
      createSocketMiddleware("wss://vnsync-server-33vh3.ondigitalocean.app")
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
