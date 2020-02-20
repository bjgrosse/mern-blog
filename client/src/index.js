import React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import store from "./store";

import { initialize as initializeAuth } from "./Auth/AuthService";

initializeAuth(store.dispatch);

ReactDOM.render(<App store={store} />, document.getElementById("root"));
