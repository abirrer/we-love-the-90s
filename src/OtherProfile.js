import React, { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            first: "",
            last: "",
            email: "",
            bio: "",
            profilepic: "/images/defaultprofile.png"
        };
    }

    componentDidMount() {
        axios.get(`/otherUser/${this.props.match.params.userId}`).then(res => {
            if (res.data.sameProfile) {
                return this.props.history.push("/");
            } else {
                this.setState({
                    id: res.data.id,
                    first: res.data.first,
                    last: res.data.last,
                    email: res.data.email,
                    bio: res.data.bio,
                    profilepic: res.data.profilepic || this.state.profilepic
                });
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        //compare this.props with nextProps.  if they are the same, then do nothing.
        //If they are different then this.setState() which will rerender the page.
        if (this.props != nextProps) {
            this.setState({
                id: nextProps.id,
                first: nextProps.first,
                last: nextProps.last,
                email: nextProps.email,
                bio: nextProps.bio,
                profilepic: nextProps.profilepic || this.state.profilepic
            });
        } else {
            return;
        }
    }

    render() {
        return (
            <div id="app__outer-box">
                <div id="app__cover-background" />
                <div id="profilepic__outer-box">
                    <img
                        src={this.state.profilepic}
                        alt={`${this.state.first} ${this.state.last}`}
                    />
                </div>
                <div>
                    <h1>
                        {this.state.first} {this.state.last}
                    </h1>
                    <div>
                        <p> {this.state.bio} </p>
                    </div>
                </div>
            </div>
        );
    }
}
