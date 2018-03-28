import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./Registration.js";
import Login from "./Login.js";

// ------------------------------------------------------------ //

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>We &hearts; The 90s!</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
