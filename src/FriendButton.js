import React, { Component } from "react";
import axios from "./axios";

export default class FriendButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            senderId: "",
            receiverId: "",
            friendshipStatus: ""
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        axios
            .get("/loadFriendButton/" + this.props.otherId)
            .then(res => {
                console.log(
                    "here is the result from the axios.get request: ",
                    res
                );
                this.setState({
                    senderId: res.data.senderId,
                    receiverId: res.data.receiverId || this.props.otherId,
                    friendshipStatus: res.data.friendshipStatus
                });
            })
            .then(() => console.log("new state friend button: ", this.state));
    }

    handleClick(e) {
        e.preventDefault();

        const { friendshipStatus } = this.state;

        const data = {
            senderId: this.state.senderId,
            receiverId: this.state.receiverId,
            friendshipStatus: this.state.friendshipStatus
        };

        if (friendshipStatus == 0 || 3 || 4 || 5) {
            axios.post("/sendfriendrequest", { data });
            // } else if (friendshipStatus == 2) {
            //     axios.post("/unfriend");
        } else if (friendshipStatus == 1) {
            // if (e.target.text == "Withdraw Friend Request") {
            axios.post("/withdrawfriendrequest", { data });
            // } else if (
            //     e.target.text == "Accept Friend Request" ||
            //     "Reject Friend Request"
            // ) {
            //     axios.post("/updatefriendrequest");
            // }
        }
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                {getButtonText(this.state.friendshipStatus)}
            </button>
        );
    }
}

function getButtonText(friendshipStatus) {
    var text = "";
    switch (friendshipStatus) {
        case 0: //no friendship
            text = "Send Friend Request";
            break;
        case 1: //pending
            text = "Withdraw Friend Request"; // and need to have another button for "Accept Friend Request"
            break;
        case 2: //accepted
            text = "Unfriend";
            break;
        case 3: //rejected
            text = "Send Friend Request";
            break;
        case 4: //unfriended
            text = "Send Friend Request";
            break;
        case 5: //withdrawn
            text = "Send Friend Request";
            break;
        default:
            text = "Send Friend Request";
    }
    return text;
}
