import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

// ------------------------------------------------------------ //

export default class Registration extends React.Component {
    constructor() {
        super();

        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
            error: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                console.log("new state", this.state);
            }
        );
    }

    handleSubmit(e) {
        const { first, last, email, password } = this.state;
        console.log(first, last, email, password);
        e.preventDefault();

        axios
            .post("/welcome/register", {
                first,
                last,
                email,
                password
            })
            .then(res => {
                if (res.data.success) {
                    console.log("success with registration handleSubmit");
                    location.replace("/");
                } else {
                    console.log("error with registration handleSubmit");
                    this.setState({
                        error: true
                    });
                }
            });
    }

    render() {
        return (
            <div>
                <form>
                    <input
                        onChange={this.handleChange}
                        name="first"
                        type="text"
                        placeholder="First Name"
                    />
                    <input
                        onChange={this.handleChange}
                        name="last"
                        type="text"
                        placeholder="Last Name"
                    />
                    <input
                        onChange={this.handleChange}
                        name="email"
                        type="email"
                        placeholder="Email Address"
                    />
                    <input
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                    <button onClick={this.handleSubmit}>Register</button>
                </form>
                <p>
                    Already a member? <Link to="/login">Log In</Link>.
                </p>
            </div>
        );
    }
}
