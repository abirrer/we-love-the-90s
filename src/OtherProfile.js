import React, { Component } from "react";
import axios from "./axios";
import FriendButton from "./FriendButton.js";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            otherId: "",
            otherFirst: "",
            otherLast: "",
            otherEmail: "",
            otherBio: "",
            otherProfilepic: "/images/defaultprofile.png"
        };
    }

    componentDidMount() {
        axios.get(`/otherUser/${this.props.match.params.userId}`).then(res => {
            if (res.data.sameProfile) {
                return this.props.history.push("/");
            } else {
                this.setState({
                    //with all user info and friendshipStatus
                    otherId: res.data.otherId,
                    otherFirst: res.data.otherFirst,
                    otherLast: res.data.otherLast,
                    otherEmail: res.data.otherEmail,
                    otherBio: res.data.otherBio,
                    otherProfilepic:
                        res.data.otherProfilepic || this.state.otherProfilepic
                });
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        //compare this.props with nextProps.  if they are the same, then do nothing.
        //If they are different then this.setState() which will rerender the page.
        if (this.props != nextProps) {
            this.setState({
                otherId: nextProps.otherId,
                otherFirst: nextProps.otherFirst,
                otherLast: nextProps.otherLast,
                otherEmail: nextProps.otherEmail,
                otherBio: nextProps.otherBio,
                otherProfilepic:
                    nextProps.otherProfilepic || this.state.otherProfilepic
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
                        src={this.state.otherProfilepic}
                        alt={`${this.state.otherFirst} ${this.state.otherLast}`}
                    />
                </div>
                <FriendButton otherId={this.props.match.params.userId} />
                <div>
                    <h1>
                        {this.state.otherFirst} {this.state.otherLast}
                    </h1>
                    <div>
                        <p> {this.state.otherBio} </p>
                    </div>
                </div>
            </div>
        );
    }
}