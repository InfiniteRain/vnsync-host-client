import React, { Dispatch, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { RoomUser } from "../interfaces/RoomUser";
import { emitEvent } from "../helpers";
import { Window } from "../interfaces/Window";
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core";

import blue from "@material-ui/core/colors/blue";
import { useDispatch, useSelector } from "react-redux";
import { SettingsState } from "../reducers/settingsReducer";
import { CombinedAction, CombinedState } from "../reducers";
import { InputsState } from "../reducers/inputsReducer";
import { GameState } from "../reducers/gameReducer";
import { Route, HashRouter } from "react-router-dom";
import { Startup } from "./Startup";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
  },
});

export const App = (): JSX.Element => {
  //const [isLoading, setLoading] = useState(false);
  //const [lastError, setLastError] = useState("");

  //const [connection, setConnection] = useState<Socket | null>(null);
  //const [windows, setWindows] = useState<Window[]>([]);
  //const [selectedWindow, setSelectedWindow] = useState(0);

  //const dispatch = useDispatch<Dispatch<CombinedAction>>();

  /*const settingsState = useSelector<CombinedState, SettingsState>(
    (state) => state.settings
  ); /*

  const setSettingSelectedWindow = (handle: number) => {
    dispatch({ type: "SETTING_SELECTED_WINDOW", payload: handle });
  };
  const setSettingInputType = (type: "enterKeyPress" | "leftMouseClick") => {
    dispatch({ type: "SETTING_INPUT_TYPE", payload: type });
  };
  const setSettingDoubleClick = (enabled: boolean) => {
    dispatch({ type: "SETTING_DOUBLE_CLICK", payload: enabled });
  };
  const setSettingTimeoutBdau = (timeout: number) => {
    dispatch({ type: "SETTING_TIMEOUT_BDAU", payload: timeout });
  };
  const setSettingTimeoutBaai = (timeout: number) => {
    dispatch({ type: "SETTING_TIMEOUT_BAAI", payload: timeout });
  };

  const gameState = useSelector<CombinedState, GameState>(
    (state) => state.game
  );

  const setGameHosting = (isHosting: boolean) => {
    dispatch({ type: "GAME_HOSTING", payload: isHosting });
  };
  const setGameRoomName = (roomName: string) => {
    dispatch({ type: "GAME_ROOM_NAME", payload: roomName });
  };
  const setGameRoomState = (roomState: RoomUser[]) => {
    dispatch({ type: "GAME_ROOM_STATE", payload: roomState });
  };
  const setGameHostUser = (hostUser: RoomUser | null) => {
    dispatch({ type: "GAME_HOST_USER", payload: hostUser });
  };
  const resetGame = () => {
    dispatch({ type: "GAME_RESET" });
  };

  const selectedWindowRef = useRef<number>();
  const inputSettingsRef = useRef<SettingsState>();

  selectedWindowRef.current = settingsState.selectedWindow;
  inputSettingsRef.current = settingsState;

  const onToggleReady = async () => {
    setLoading(true);

    const handle = selectedWindowRef.current;
    const windowExists = await vnSync.windowExists(handle);

    if (windowExists) {
      await vnSync.activateWindow(handle);
    }

    const result = await emitEvent<undefined>(connection, "toggleReady");

    if (result.status !== "ok") {
      setLastError(result.failMessage);
      connection.disconnect();
      return;
    }

    setLoading(false);
  };*/

  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Route path="/" component={Startup} />
      </ThemeProvider>
    </HashRouter>
  );

  /*
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {lastError !== "" && <h3>Error: {lastError}</h3>}
      {!gameState.isHosting && (
        
      )}
      {false && (
        <Grid container className={classes.root}>
          <Grid item xs={6}>
            <Box className={classes.partialPanel}>
              <Paper className={classes.panel} square>
                1
              </Paper>
            </Box>
            <Box className={classes.partialPanel}>
              <Paper className={classes.panel} square>
                2
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className={classes.panel}>
              <Paper className={classes.panel} square>
                3
              </Paper>
            </Box>
          </Grid>
        </Grid>
      )}
      {gameState.isHosting && (
        <>
          <h3>Room name: {gameState.roomName}</h3>
          <ul>
            {gameState.roomState.map((roomUser) => (
              <li key={roomUser.username}>
                {roomUser.username} - {!roomUser.isReady && "not"} ready
              </li>
            ))}
          </ul>
          <button onClick={onToggleReady} disabled={isLoading}>
            {gameState.hostUser.isReady ? "Unready" : "Ready"}
          </button>
          <hr />
          <select
            disabled={isLoading}
            onChange={(e) => {
              setSettingSelectedWindow(Number.parseInt(e.target.value));
            }}
            defaultValue={settingsState.selectedWindow}
          >
            <option value="0">-</option>
            {windows.map((window) => (
              <option value={window.handle}>{window.title}</option>
            ))}
          </select>
          &nbsp;
          <button
            disabled={isLoading}
            onClick={async () => {
              setWindows(await vnSync.getOpenedWindows());
            }}
          >
            Refresh windows
          </button>
          <br />
          <label>Double click: </label>
          <input
            type="checkbox"
            checked={settingsState.isDoubleClick}
            onChange={(e) => {
              setSettingDoubleClick(e.target.checked);
            }}
          />
          <br />
          <label>Time between input press up and down: </label>
          <input
            type="number"
            value={settingsState.timeoutBetweenDownAndUp}
            onChange={(e) => {
              setSettingTimeoutBdau(Number.parseInt(e.target.value));
            }}
          />
          <br />
          <label>Time between window activation and input: </label>
          <input
            type="number"
            value={settingsState.timeoutBetweenActivationAndInput}
            onChange={(e) => {
              setSettingTimeoutBaai(Number.parseInt(e.target.value));
            }}
          />
          <br />
          <label>Input type: </label>
          <select
            value={settingsState.type}
            onChange={(e) => {
              setSettingInputType(e.target.value as SettingsState["type"]);
            }}
          >
            <option value="enterKeyPress">Enter key press</option>
            <option value="leftMouseClick">Left mouse click</option>
          </select>
        </>
      )}
    </ThemeProvider>
  );
  */
};
