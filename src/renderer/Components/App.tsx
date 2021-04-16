import React, { Dispatch, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { RoomUser } from "../interfaces/RoomUser";
import { emitEvent } from "../helpers";
import { Window } from "../interfaces/Window";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { createMuiTheme } from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import { useDispatch, useSelector } from "react-redux";
import { SettingsState, SettingsAction } from "../reducers/settingsReducer";
import { CombinedAction, CombinedState } from "../reducers";
import { InputsState } from "../reducers/inputsReducer";
import { GameState } from "../reducers/gameReducer";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(3),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  panel: {
    width: "100%",
    height: "100%",
    padding: theme.spacing(1),
  },
  partialPanel: {
    width: "100%",
    height: "50%",
    padding: theme.spacing(1),
  },
}));

export const App = (): JSX.Element => {
  const [isLoading, setLoading] = useState(false);
  const [lastError, setLastError] = useState("");

  const [connection, setConnection] = useState<Socket | null>(null);
  const [windows, setWindows] = useState<Window[]>([]);
  const [selectedWindow, setSelectedWindow] = useState(0);

  const dispatch = useDispatch<Dispatch<CombinedAction>>();

  const settingsState = useSelector<CombinedState, SettingsState>(
    (state) => state.settings
  );

  const inputState = useSelector<CombinedState, InputsState>(
    (state) => state.inputs
  );

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

  selectedWindowRef.current = selectedWindow;
  inputSettingsRef.current = settingsState;

  const onStartHosting = () => {
    setLoading(true);

    const username = inputState.username.trim();
    const connection = io("wss://vnsync-server-33vh3.ondigitalocean.app");

    connection.on("connect", async () => {
      const result = await emitEvent<string>(
        connection,
        "createRoom",
        username
      );

      if (result.status !== "ok") {
        setLastError(result.failMessage);
        connection.disconnect();
        return;
      }

      setGameHosting(true);
      setLoading(false);
      setGameRoomName(result.data);
      setLastError("");
      setWindows(await vnSync.getOpenedWindows());
    });

    connection.on("disconnect", () => {
      resetGame();
      setLoading(false);
      setWindows([]);
      setSelectedWindow(0);
      setConnection(null);
    });

    connection.on("roomStateChange", (roomState: RoomUser[]) => {
      setGameRoomState(roomState);
      setGameHostUser(
        roomState.find((roomUser) => roomUser.username === username)
      );
    });

    connection.on("roomReady", async () => {
      const handle = selectedWindowRef.current;
      const exists = await vnSync.windowExists(handle);

      if (!exists) {
        alert("Window no longer exists!");
        return;
      }

      setLoading(true);
      await vnSync.initiateInput(handle, inputSettingsRef.current);
      setLoading(false);
    });

    setConnection(connection);
  };

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
  };

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {lastError !== "" && <h3>Error: {lastError}</h3>}
      {!gameState.isHosting && (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          className={classes.root}
        >
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={3} variant="outlined">
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                VNSync Host
              </Typography>
              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Username"
                  autoComplete="username"
                  autoFocus
                  value={inputState.username}
                  onChange={(e) => {
                    dispatch({
                      type: "INPUT_USERNAME",
                      payload: e.target.value,
                    });
                  }}
                  disabled={isLoading}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onStartHosting}
                  disabled={isLoading}
                >
                  Start Room
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
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
              setSelectedWindow(Number.parseInt(e.target.value));
            }}
            defaultValue={selectedWindow}
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
              dispatch({
                type: "SETTING_DOUBLE_CLICK",
                payload: e.target.checked,
              });
            }}
          />
          <br />
          <label>Time between input press up and down: </label>
          <input
            type="number"
            value={settingsState.timeoutBetweenDownAndUp}
            onChange={(e) => {
              dispatch({
                type: "SETTING_TIMEOUT_BDAU",
                payload: Number.parseInt(e.target.value),
              });
            }}
          />
          <br />
          <label>Time between window activation and input: </label>
          <input
            type="number"
            value={settingsState.timeoutBetweenActivationAndInput}
            onChange={(e) => {
              dispatch({
                type: "SETTING_TIMEOUT_BAAI",
                payload: Number.parseInt(e.target.value),
              });
            }}
          />
          <br />
          <label>Input type: </label>
          <select
            value={settingsState.type}
            onChange={(e) => {
              dispatch({
                type: "SETTING_INPUT_TYPE",
                payload: e.target.value as SettingsState["type"],
              });
            }}
          >
            <option value="enterKeyPress">Enter key press</option>
            <option value="leftMouseClick">Left mouse click</option>
          </select>
        </>
      )}
    </ThemeProvider>
  );
};
