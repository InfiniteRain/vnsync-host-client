import React, { useEffect, useRef, useState } from "react";
import {
  setDoubleClick,
  setInputType,
  setSelectedWindow,
  setTimeoutBaai,
  setTimeoutBdau,
  SettingsState,
} from "../redux/settingsReducer";
import { Window } from "../interfaces/Window";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
} from "@material-ui/core";
import DoneOutline from "@material-ui/icons/DoneOutline";
import Clear from "@material-ui/icons/Clear";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toggleReady, updateClipboard } from "../redux/socketActions";
import { useHistory } from "react-router";
import { connectionEventEmitter } from "../redux/socketLogic";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gridTemplateRows: "repeat(auto-fit, minmax(240px, 1fr))",
    gridTemplateAreas: "'users clipboard' 'ready-status clipboard'",
    height: "100vh",
    ["@media (max-width: 500px)"]: {
      gridTemplateAreas: "'users' 'ready-status'",
    },
    ["@media (max-width: 500px) and (min-height: 730px)"]: {
      gridTemplateAreas: "'users' 'ready-status' 'clipboard'",
    },
    padding: "5px",
  },
  clipboard: {
    gridArea: "clipboard",
    margin: "5px",
    ["@media (max-width: 500px) and (max-height: 730px)"]: {
      display: "none",
    },
  },
  users: {
    gridArea: "users",
    margin: "5px",
  },
  readyStatus: {
    gridArea: "ready-status",
    margin: "5px",
  },
  panel: {
    height: "100%",
    padding: theme.spacing(1),
    overflow: "auto",
  },
  button: {
    height: "100%",
  },
}));

export const Game = (): JSX.Element => {
  const [isLoading, setLoading] = useState(false);
  const [windows, setWindows] = useState<Window[]>([]);

  const dispatch = useAppDispatch();
  const history = useHistory();

  const gameState = useAppSelector((state) => state.game);
  const settingsState = useAppSelector((state) => state.settings);

  const selectedWindowRef = useRef(0);
  selectedWindowRef.current = settingsState.selectedWindow;

  useEffect(() => {
    vnSync.getOpenedWindows().then((windows) => {
      console.log("windows: ", windows);
      setWindows(windows);
    });

    let lastClipboardEntry: string | null = null;

    const clipboardInterval = setInterval(async () => {
      const clipboardEntry = await vnSync.getCurrentClipboardEntry();

      if (
        lastClipboardEntry !== clipboardEntry &&
        lastClipboardEntry !== null
      ) {
        dispatch(updateClipboard(clipboardEntry));
      }

      lastClipboardEntry = clipboardEntry;
    }, 100);

    const onReconnectAttempt = () => {
      setLoading(true);
    };

    const onReconnect = () => {
      setLoading(false);
    };

    const onDisconnect = () => {
      history.push("/");
    };

    connectionEventEmitter.on("reconnectAttempt", onReconnectAttempt);
    connectionEventEmitter.on("reconnect", onReconnect);
    connectionEventEmitter.on("disconnect", onDisconnect);

    return () => {
      clearInterval(clipboardInterval);
      connectionEventEmitter.removeListener(
        "reconnectAttempt",
        onReconnectAttempt
      );
      connectionEventEmitter.removeListener("reconnect", onReconnect);
      connectionEventEmitter.removeListener("disconnect", onDisconnect);
    };
  }, []);

  const onToggleReady = async () => {
    setLoading(true);

    const handle = selectedWindowRef.current;
    const windowExists = await vnSync.windowExists(handle);

    if (windowExists) {
      await vnSync.activateWindow(handle);
    }

    dispatch(
      toggleReady({
        onComplete() {
          setLoading(false);
        },
      })
    );
  };

  const classes = useStyles();

  return (
    <Box className={classes.gridContainer}>
      <Box className={classes.users}>
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

      <Box className={classes.readyStatus}>
        <Paper className={classes.panel} square>
          <Button
            fullWidth
            variant="contained"
            color={gameState.hostUser?.isReady ? undefined : "primary"}
            className={classes.button}
            onClick={onToggleReady}
            disabled={isLoading}
          >
            {gameState.hostUser?.isReady ? "Unready" : "Ready"}
          </Button>
        </Paper>
      </Box>

      <Box className={classes.clipboard}>
        <Paper className={classes.panel} square>
          <h3>Room name: {gameState.roomName}</h3>
          <hr />
          <select
            disabled={isLoading}
            onChange={(e) => {
              dispatch(setSelectedWindow(Number(e.target.value)));
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
              dispatch(setDoubleClick(e.target.checked));
            }}
          />
          <br />
          <label>Time between input press up and down: </label>
          <input
            type="number"
            value={settingsState.timeoutBetweenDownAndUp}
            onChange={(e) => {
              dispatch(setTimeoutBdau(Number(e.target.value)));
            }}
          />
          <br />
          <label>Time between window activation and input: </label>
          <input
            type="number"
            value={settingsState.timeoutBetweenActivationAndInput}
            onChange={(e) => {
              dispatch(setTimeoutBaai(Number(e.target.value)));
            }}
          />
          <br />
          <label>Input type: </label>
          <select
            value={settingsState.inputType}
            onChange={(e) => {
              dispatch(
                setInputType(e.target.value as SettingsState["inputType"])
              );
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
    </Box>
  );
};
