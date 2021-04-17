import { GameAction, GameState } from "./gameReducer";
import { InputsAction, InputsState } from "./inputsReducer";
import { SettingsAction, SettingsState } from "./settingsReducer";
import { SocketAction } from "./socketMiddleware";

export interface CombinedState {
  settings: SettingsState;
  inputs: InputsState;
  game: GameState;
}

export type CombinedAction =
  | SocketAction
  | SettingsAction
  | InputsAction
  | GameAction;
