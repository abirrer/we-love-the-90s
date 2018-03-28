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

    componentDidMount(id) {
        axios
            .get(`/otherUser/${id || this.props.match.params.userId}`)
            .then(res => {
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
                            res.data.otherProfilepic ||
                            this.state.otherProfilepic
                    });
                }
            });
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("prev state", prevState, this.state);
    }

    componentWillReceiveProps(nextProps) {
        //compare this.props with nextProps.  if they are the same, then do nothing.
        //If they are different then this.setState() which will rerender the page.
        if (nextProps.match.params.id != this.props.otherId) {
            this.componentDidMount(nextProps.match.params.id);
        }
    }

    render() {
        return (
            <div id="profile__outer-box">
                <div id="profile__cover-background" />
                <div id="profilepic__outer-box">
                    <img
                        src={this.state.otherProfilepic}
                        alt={`${this.state.otherFirst} ${this.state.otherLast}`}
                    />
                </div>
                <div id="profile__information">
                    <h1>
                        {this.state.otherFirst} {this.state.otherLast}
                    </h1>
                    <p> {this.state.otherBio} </p>
                    <FriendButton otherId={this.props.match.params.userId} />
                </div>
            </div>
        );
    }
}
