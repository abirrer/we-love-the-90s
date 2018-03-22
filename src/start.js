import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./Welcome.js";
import App from "./App.js";
import reducer from "./reducers";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

const elem = (
    <Provider store={store}>
        <App />
    </Provider>
);

console.log("URL", location.pathname);

if (location.pathname == "/welcome") {
    ReactDOM.render(<Welcome />, document.querySelector("main"));
} else {
    ReactDOM.render(elem, document.querySelector("main"));
}
