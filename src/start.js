import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./Welcome.js";
import App from "./App.js";

console.log("URL", location.pathname);

if (location.pathname == "/welcome") {
    ReactDOM.render(<Welcome />, document.querySelector("main"));
} else {
    ReactDOM.render(<App />, document.querySelector("main"));
}
