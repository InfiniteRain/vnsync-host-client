import React, { Dispatch, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CombinedAction, CombinedState } from "../reducers";
import { SettingsState } from "../reducers/settingsReducer";
import { Window } from "../interfaces/Window";
import { GameState } from "../reducers/gameReducer";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
} from "@material-ui/core";
import DoneOutline from "@material-ui/icons/DoneOutline";
import Clear from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  panel: {
    width: "100%",
    height: "100%",
    maxHeight: "100vh",
    padding: theme.spacing(1),
    overflow: "auto",
  },
  partialPanel: {
    width: "100%",
    height: "50%",
    padding: theme.spacing(1),
  },
  button: {
    height: "100%",
  },
}));

export const Game = (): JSX.Element => {
  const [isLoading, setLoading] = useState(false);
  const [windows, setWindows] = useState<Window[]>([]);

  const dispatch = useDispatch<Dispatch<CombinedAction>>();

  const socketToggleReady = (onComplete: () => void): void => {
    dispatch({ type: "SOCKET_TOGGLE_READY", payload: { onComplete } });
  };
  const socketUpdateClipboard = (clipboardEntry: string): void => {
    dispatch({ type: "SOCKET_UPDATE_CLIPBOARD", payload: clipboardEntry });
  };

  const gameState = useSelector<CombinedState, GameState>(
    (state) => state.game
  );

  const settingsState = useSelector<CombinedState, SettingsState>(
    (state) => state.settings
  );

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

  const selectedWindowRef = useRef(0);
  selectedWindowRef.current = settingsState.selectedWindow;

  useEffect(() => {
    vnSync.getOpenedWindows().then((windows) => {
      setWindows(windows);
    });

    let lastClipboardEntry: string | null = null;
    const clipboardInterval = setInterval(async () => {
      const clipboardEntry = await vnSync.getCurrentClipboardEntry();

      if (
        lastClipboardEntry !== clipboardEntry &&
        lastClipboardEntry !== null
      ) {
        socketUpdateClipboard(clipboardEntry);
      }

      lastClipboardEntry = clipboardEntry;
    }, 100);
    return () => clearInterval(clipboardInterval);
  }, []);

  const toggleReady = async () => {
    setLoading(true);

    const handle = selectedWindowRef.current;
    const windowExists = await vnSync.windowExists(handle);

    if (windowExists) {
      await vnSync.activateWindow(handle);
    }

    socketToggleReady(() => {
      setLoading(false);
    });
  };

  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={4}>
        <Box className={classes.partialPanel}>
          <Paper className={classes.panel} square>
            <List dense>
              {gameState.roomState.membersState.map((roomUser) => (
                <ListItem>
                  <ListItemIcon>
                    {roomUser.isReady ? <DoneOutline /> : <Clear />}
                  </ListItemIcon>
                  <ListItemText primary={roomUser.username} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
        <Box className={classes.partialPanel}>
          <Paper className={classes.panel} square>
            <Button
              fullWidth
              variant="contained"
              color={gameState.hostUser.isReady ? undefined : "primary"}
              className={classes.button}
              onClick={toggleReady}
            >
              {gameState.hostUser.isReady ? "Unready" : "Ready"}
            </Button>
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={8}>
        <Box className={classes.panel}>
          <Paper className={classes.panel} square>
            <h3>Room name: {gameState.roomName}</h3>
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
            <hr />
            {gameState.roomState.clipboard.map((clipboardEntry) => (
              <p>{clipboardEntry}</p>
            ))}
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
  /*
  return (
    <>
     
      <ul>
        {gameState.roomState.map((roomUser) => (
          <li key={roomUser.username}>
            {roomUser.username} - {!roomUser.isReady && "not"} ready
          </li>
        ))}
      </ul>
      <button onClick={toggleReady} disabled={isLoading}>
        
      </button>
      
    </>
  );*/
};
