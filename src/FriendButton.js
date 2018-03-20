import React, { Component } from "react";
import axios from "./axios";

export default class FriendButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            senderId: null,
            receiverId: null,
            friendshipStatus: null
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        console.log("this.state before: ", this.state);
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
            .then(() => console.log("this.state after: ", this.state));
    }

    handleClick(e) {
        e.preventDefault();

        const { friendshipStatus } = this.state;

        let data = {
            senderId: this.state.senderId,
            receiverId: this.state.receiverId,
            friendshipStatus: this.state.friendshipStatus
        };

        if (
            friendshipStatus == 0 ||
            friendshipStatus == 3 ||
            friendshipStatus == 4 ||
            friendshipStatus == 5
        ) {
            axios.post("/sendfriendrequest", data).then(res => {
                this.setState({
                    senderId: res.data.senderId,
                    receiverId: res.data.receiverId || this.props.otherId,
                    friendshipStatus: res.data.friendshipStatus
                });
            });
        } else if (friendshipStatus == 2) {
            data.friendshipStatus = 4;

            axios.post("/updatefriendrequest", data).then(res => {
                this.setState({
                    senderId: res.data.senderId,
                    receiverId: res.data.receiverId || this.props.otherId,
                    friendshipStatus: res.data.friendshipStatus
                });
            });
        } else if (friendshipStatus == 1) {
            if (this.props.otherId == this.state.receiverId) {
                data.friendshipStatus = 5;
            } else if (this.props.otherId != this.state.receiverId) {
                data.friendshipStatus = 2;
            }

            axios.post("/updatefriendrequest", data).then(res => {
                this.setState({
                    senderId: res.data.senderId,
                    receiverId: res.data.receiverId || this.props.otherId,
                    friendshipStatus: res.data.friendshipStatus
                });
            });
        }
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                {getButtonText(
                    this.state.friendshipStatus,
                    this.props.otherId,
                    this.state.receiverId
                )}
            </button>
        );
    }
}

function getButtonText(friendshipStatus, otherId, receiverId) {
    var text = "";
    switch (friendshipStatus) {
        case 0: //no friendship
            text = "Send Friend Request";
            break;
        case 1: //pending
            if (otherId == receiverId) {
                text = "Withdraw Friend Request";
            } else {
                text = "Accept Friend Request";
            }
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
