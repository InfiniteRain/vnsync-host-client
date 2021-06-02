import React from "react";
import { CssBaseline, ThemeProvider, createMuiTheme } from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import { Route, HashRouter, Redirect } from "react-router-dom";
import { Startup } from "./Startup";
import { Game } from "./Game";
import { useAppSelector } from "../redux/hooks";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
  },
});

export const App = (): JSX.Element => {
  const gameState = useAppSelector((state) => state.game);

  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Route path="/" component={Startup} exact />
        <Route
          path="/game"
          render={() => {
            if (!gameState.isHosting) {
              return <Redirect to="/" />;
            }

            return <Game />;
          }}
          exact
        />
      </ThemeProvider>
    </HashRouter>
  );
};
