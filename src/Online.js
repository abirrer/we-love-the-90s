import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

function mapStateToProps(state) {
    return {
        onlineUsers: state.onlineUsers || []
    };
}

class Online extends React.Component {
    componentDidMount() {}

    render() {
        const { onlineUsers } = this.props;

        if (!onlineUsers) {
            return null;
        }

        const onlineUsersElem = (
            <div className="friends__outer-box">
                {onlineUsers.map(onlineUser => (
                    <div className="friend-box">
                        <Link to={`/user/${onlineUser.id}`}>
                            <img src={onlineUser.profile_pic_url} />
                        </Link>
                        <div className="friend-box__info">
                            <h3>
                                {onlineUser.first} {onlineUser.last}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        );

        return (
            <div id="online-user-box">
                <h2>Online Users</h2>
                <div className="border" />

                <a href="/chat">
                    <button>Chat Room</button>
                </a>

                <div id="">
                    {!onlineUsers.length && (
                        <div>You are the only user currently online!</div>
                    )}
                    {!!onlineUsers.length && onlineUsersElem}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Online);
