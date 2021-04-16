import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { rootReducer } from "./reducers/settingsReducer";
import { Provider } from "react-redux";
import { App } from "./components/App";
import "./assets/roboto.css";
import "./assets/main.css";

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
