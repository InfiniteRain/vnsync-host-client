import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import { settingsReducer } from "./reducers/settingsReducer";
import { Provider } from "react-redux";
import { App } from "./components/App";
import "./assets/roboto.css";
import "./assets/main.css";
import { inputsReducer } from "./reducers/inputsReducer";
import { gameReducer } from "./reducers/gameReducer";

const store = createStore(
  combineReducers({
    settings: settingsReducer,
    inputs: inputsReducer,
    game: gameReducer,
  })
);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
