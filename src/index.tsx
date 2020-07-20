import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import React from "react";
import { render } from "react-dom";

import AppContainer from "./containers/AppContainer";

render(<AppContainer />, document.getElementById("app"));
