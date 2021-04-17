import {
  Avatar,
  Grid,
  Paper,
  makeStyles,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import PersonalVideoOutlined from "@material-ui/icons/PersonalVideoOutlined";
import React, { Dispatch, FormEvent, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useHistory } from "react-router-dom";
import { CombinedAction, CombinedState } from "../reducers";
import { InputsState } from "../reducers/inputsReducer";

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
  alert: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
}));

export const Startup = (): JSX.Element => {
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();
  const dispatch = useDispatch<Dispatch<CombinedAction>>();
  const store = useStore<CombinedState>();
  const state = store.getState();

  const connect = (username: string) => {
    setLoading(true);
    dispatch({
      type: "SOCKET_CONNECT",
      payload: {
        username,
        onComplete: () => {
          setLoading(false);
          history.push("/game");
        },
        onError: (message: string) => {
          setLoading(false);
          setErrorMessage(message);
        },
      },
    });
  };

  const inputState = useSelector<CombinedState, InputsState>(
    (state) => state.inputs
  );

  const setInputUsername = (username: string) => {
    dispatch({ type: "INPUT_USERNAME", payload: username });
  };

  const initalizeConnection = () => {
    const state: CombinedState["inputs"] = store.getState().inputs;

    const username = state.username.trim();

    if (username.length > 0) {
      connect(username);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    initalizeConnection();
  };

  const classes = useStyles();

  return (
    <>
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
              <PersonalVideoOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
              VNSync Host
            </Typography>
            <form className={classes.form} noValidate onSubmit={onSubmit}>
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
                  setInputUsername(e.target.value);
                }}
                disabled={isLoading}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={initalizeConnection}
                disabled={isLoading || state.inputs.username.trim().length <= 0}
              >
                Start Room
              </Button>
            </form>
            {errorMessage !== "" && (
              <Alert severity="error" className={classes.alert}>
                {errorMessage}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
