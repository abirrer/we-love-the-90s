import React, { Component } from "react";
import axios from "./axios";
import App from "./App";

export default class ProfilePicUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profilepic: "",
            error: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.files[0]
            },
            () => {
                console.log("new state", this.state);
            }
        );
    }

    handleSubmit(e) {
        console.log("Here is profile pic: ", this.state.profilepic);
        e.preventDefault();

        const formData = new FormData();
        formData.append("profilepic", this.state.profilepic);

        console.log("formData looks like: ", formData);

        // var app = this;
        axios.post("/upload", formData).then(res => {
            if (res.data.success) {
                console.log("success with profilepic handleSubmit");
                this.props.setImage(res.data.profilepic);
                // location.replace("/"); //call a function this.props.setImage and pass it url from the response.
            } else {
                console.log("error with profilepic handleSubmit");
                this.setState({
                    error: res.data.error
                });
            }
        });
    }

    render() {
        return (
            <div id="profilepic-upload__outer-box">
                <div id="profilepic-upload__inner-box">
                    <div id="close-button">
                        <h3 onClick={this.props.toggleUploadModal}>X</h3>
                    </div>
                    <h2>Upload A New Profile Picture</h2>
                    {this.state.error && (
                        <p className="error-message">{this.state.error}</p>
                    )}
                    <form>
                        <input
                            onChange={this.handleChange}
                            type="file"
                            name="profilepic"
                        />
                        <button onClick={this.handleSubmit}>Upload</button>
                    </form>
                </div>
            </div>
        );
    }
}
