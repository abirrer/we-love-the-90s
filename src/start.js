import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./Welcome.js";
import Logo from "./Logo.js"

console.log("URL", location.pathname); //use the location.pathname to look at urlname
//check for URL, if it is /welcome, load the welcome component
//into ReactDOM.render....otherwise, render Logo
//we will use req.session to set the logged in user, etc.

if (location.pathname == "/welcome") {
    ReactDOM.render(<Welcome />, document.querySelector("main"));
} else {
    ReactDOM.render(<Logo />, document.querySelector("main"));
}
