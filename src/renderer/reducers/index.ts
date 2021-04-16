import { InputsAction, InputsState } from "./inputsReducer";
import { SettingsAction, SettingsState } from "./settingsReducer";

export interface CombinedState {
  settings: SettingsState;
  inputs: InputsState;
}

export type CombinedAction = SettingsAction | InputsAction;
