import React from "react";
import Registration from "./Registration.js";
import Logo from "./Logo.js"
import axios from "axios";

export default class Welcome extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Logo />
                <Registration />
            </div>
        )
    }
}
