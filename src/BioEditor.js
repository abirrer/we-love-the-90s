import React, { Component } from "react";
import axios from "./axios";
import App from "./App";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bio: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        console.log(e.target);
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
        e.preventDefault();
        if (this.state.bio == "") {
            this.props.toggleBioModal();
        } else {
            axios.post("/updateBio", { bio: this.state.bio }).then(res => {
                if (res.data.success) {
                    this.props.setBio(res.data.bio);
                    this.props.toggleBioModal();
                } else {
                    console.log("error with profilepic handleSubmit");
                }
            });
        }
    }

    render() {
        return (
            <div id="bio-editor">
                <input
                    onChange={this.handleChange}
                    type="text"
                    name="bio"
                    placeholder="Enter a short bio about yourself."
                />
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}
