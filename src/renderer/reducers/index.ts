import { ConnectionAction, ConnectionState } from "./connectionReducer";
import { GameAction, GameState } from "./gameReducer";
import { InputsAction, InputsState } from "./inputsReducer";
import { SettingsAction, SettingsState } from "./settingsReducer";
import { SocketAction } from "./socketMiddleware";

export interface CombinedState {
  connection: ConnectionState;
  settings: SettingsState;
  inputs: InputsState;
  game: GameState;
}

export type CombinedAction =
  | SocketAction
  | ConnectionAction
  | SettingsAction
  | InputsAction
  | GameAction;
