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
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toggleReady, updateClipboard } from "../redux/socketActions";

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

  const dispatch = useAppDispatch();

  const gameState = useAppSelector((state) => state.game);
  const settingsState = useAppSelector((state) => state.settings);

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
        dispatch(updateClipboard(clipboardEntry));
      }

      lastClipboardEntry = clipboardEntry;
    }, 100);
    return () => clearInterval(clipboardInterval);
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
              color={gameState.hostUser?.isReady ? undefined : "primary"}
              className={classes.button}
              onClick={onToggleReady}
            >
              {gameState.hostUser?.isReady ? "Unready" : "Ready"}
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
      </Grid>
    </Grid>
  );
};
