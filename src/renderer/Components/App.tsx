import React from "react";
import { CssBaseline, ThemeProvider, createMuiTheme } from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import { Route, HashRouter } from "react-router-dom";
import { Startup } from "./Startup";
import { Game } from "./Game";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
  },
});

export const App = (): JSX.Element => {
  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Route path="/" component={Startup} exact />
        <Route path="/game" component={Game} exact />
      </ThemeProvider>
    </HashRouter>
  );
};
