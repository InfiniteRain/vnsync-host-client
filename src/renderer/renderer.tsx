import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { settingsReducer } from "./reducers/settingsReducer";
import { Provider } from "react-redux";
import { App } from "./components/App";
import "./assets/roboto.css";
import "./assets/main.css";
import { inputsReducer } from "./reducers/inputsReducer";
import { gameReducer } from "./reducers/gameReducer";
import { createSocketMiddleware } from "./reducers/socketMiddleware";

const store = createStore(
  combineReducers({
    settings: settingsReducer,
    inputs: inputsReducer,
    game: gameReducer,
  }),
  {},
  applyMiddleware(
    createSocketMiddleware("wss://vnsync-server-33vh3.ondigitalocean.app")
  )
);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
