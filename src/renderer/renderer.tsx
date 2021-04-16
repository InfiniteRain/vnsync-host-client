import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import { settingsReducer } from "./reducers/settingsReducer";
import { Provider } from "react-redux";
import { App } from "./components/App";
import "./assets/roboto.css";
import "./assets/main.css";
import { inputsReducer } from "./reducers/inputsReducer";

const store = createStore(
  combineReducers({ settings: settingsReducer, inputs: inputsReducer })
);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
