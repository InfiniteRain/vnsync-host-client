import {
  Avatar,
  Grid,
  Paper,
  makeStyles,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import PersonalVideoOutlined from "@material-ui/icons/PersonalVideoOutlined";
import React, { FormEvent, useState } from "react";
import { useStore } from "react-redux";
import { useHistory } from "react-router-dom";
import { setUsername } from "../redux/inputsReducer";
import { RootState } from "../redux/store";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { connect } from "../redux/socketActions";

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
  alert: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
}));

export const Startup = (): JSX.Element => {
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();
  const dispatch = useAppDispatch();

  const store = useStore<RootState>();
  const state = store.getState();

  const onConnect = (username: string) => {
    setLoading(true);
    dispatch(
      connect({
        username,
        onComplete() {
          setLoading(false);
          history.push("/game");
        },
        onError(message: string) {
          setLoading(false);
          setErrorMessage(message);
        },
      })
    );
  };

  const inputState = useAppSelector((state) => state.inputs);

  const initalizeConnection = () => {
    const state: RootState["inputs"] = store.getState().inputs;

    const username = state.username.trim();

    if (username.length > 0) {
      onConnect(username);
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
                  dispatch(setUsername(e.target.value));
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
