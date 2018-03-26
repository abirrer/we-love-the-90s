import React from "react";
import { connect } from "react-redux";

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
            <div className="">
                {onlineUsers.map(onlineUser => (
                    <div className="friend-box">
                        <img src={onlineUser.profile_pic_url} />
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
            <div id="">
                <h2>Online Users</h2>
                <div className="border" />
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
