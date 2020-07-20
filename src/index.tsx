import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import React from "react";
import { render } from "react-dom";

import App from "./containers/AppContainer";

render(<App />, document.getElementById("app"));
