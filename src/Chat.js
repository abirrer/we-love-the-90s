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
            e.target.value = "";
            console.log(message);
            emitChatMessage(message);
            e.preventDefault();
        }
    }

    componentDidUpdate() {
        // this.chatContainer.scrollTop
        // set overflow auto
        //
        //
        //
        //
    }

    render() {
        const { chatMessages } = this.props;

        const chatMessagesElem = (
            <div className="">
                {chatMessages.map(chatMessage => (
                    <div className="message-img">
                        <img src={this.props.profilepic} />
                        <div className="message-box">
                            <p>
                                <strong>
                                    {this.props.first} {this.props.last}:
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
                    <textarea onKeyDown={this.onKeyDown} />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Chat);
