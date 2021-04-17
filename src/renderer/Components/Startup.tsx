import {
  Avatar,
  Grid,
  Paper,
  makeStyles,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React, { Dispatch, FormEvent, useEffect, useState } from "react";
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

export const Startup = (): JSX.Element => {
  const [isLoading, setLoading] = useState(false);

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
        onConnect: () => {
          setLoading(false);
          history.push("/game");
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
              <LockOutlinedIcon />
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
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
