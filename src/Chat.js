import React from "react";
import { connect } from "react-redux";
import { emitChatMessage } from "./socket";

function mapStateToProps(state) {
    return {
        chatMessages: state.chatMessages || [],
        onlineUsers: state.onlineUsers
    };
}

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.onKeyDown = this.onKeyDown.bind(this);
    }

    // componentDidMount() {
    //     // import { emitChatMessage } from "./socket"
    //     function emitChatMessage(message) {
    //         socket.emit("chatMessage", message);
    //     }
    // }

    onKeyDown(e) {
        if (e.keyCode == 13) {
            let message = e.target.value;
            let userData = {
                first: this.props.first,
                last: this.props.last,
                email: this.props.email,
                profilepic: this.props.profilepic
            };
            e.target.value = "";
            console.log(message);
            emitChatMessage(message, userData);
            e.preventDefault();
        }
    }

    componentDidUpdate() {
        this.chatContainer.scrollTop =
            this.chatContainer.scrollHeight - this.chatContainer.clientHeight;
    }

    render() {
        const { chatMessages } = this.props;
        console.log("here are chat messages object: ", chatMessages);

        const chatMessagesElem = (
            <div className="">
                {chatMessages.map((chatMessage, i) => (
                    <div key={i} className="message-outer-box">
                        <img src={chatMessage.userData.profilepic} />
                        <div className="message-inner-box">
                            <p>
                                <strong>
                                    {chatMessage.userData.first}{" "}
                                    {chatMessage.userData.last}:
                                </strong>{" "}
                                {chatMessage.messageText}
                            </p>
                            <p>
                                <i>{chatMessage.timestamp}</i>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );

        return (
            <div>
                <div
                    id="chat-message-container"
                    ref={elem => {
                        this.chatContainer = elem;
                    }}
                >
                    {!chatMessages.length && <div>Send the first message!</div>}
                    {!!chatMessages.length && chatMessagesElem}
                </div>
                <div>
                    <textarea
                        onKeyDown={this.onKeyDown}
                        placeholder="Type a message to the group."
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Chat);
