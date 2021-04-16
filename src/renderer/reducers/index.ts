import { GameAction, GameState } from "./gameReducer";
import { InputsAction, InputsState } from "./inputsReducer";
import { SettingsAction, SettingsState } from "./settingsReducer";

export interface CombinedState {
  settings: SettingsState;
  inputs: InputsState;
  game: GameState;
}

export type CombinedAction = SettingsAction | InputsAction | GameAction;
