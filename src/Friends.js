import React from "react";
import { receiveFriendsList, makeFriend, endFriendship } from "./actions";
import { connect } from "react-redux";

console.log(endFriendship);

function mapStateToProps(state) {
    return {
        friends: state.users && state.users.filter(user => user.status == 2),
        pendingFriends:
            state.users && state.users.filter(user => user.status == 1)
    };
}

class Friends extends React.Component {
    componentDidMount() {
        this.props.dispatch(receiveFriendsList());
    }

    render() {
        const { friends, pendingFriends } = this.props;

        if (!friends) {
            return null;
        }

        const friendsElem = (
            <div className="friends__inner-box">
                {friends.map(friend => (
                    <div className="friend-box">
                        <img src={friend.profile_pic_url} />
                        <div className="friend-box__info">
                            <h3>
                                {friend.first} {friend.last}
                            </h3>
                            <button
                                onClick={id =>
                                    this.props.dispatch(
                                        endFriendship(friend.id)
                                    )
                                }
                            >
                                Unfriend
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );

        const pendingFriendsElem = (
            <div className="friends__inner-box">
                {pendingFriends.map(pendingFriend => (
                    <div className="friend-box">
                        <img src={pendingFriend.profile_pic_url} />
                        <div className="pendingFriend-box__info">
                            <h3>
                                {pendingFriend.first} {pendingFriend.last}
                            </h3>
                            <button
                                value="Add Friend"
                                onClick={id =>
                                    this.props.dispatch(
                                        makeFriend(pendingFriend.id)
                                    )
                                }
                            >
                                Add Friend
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );

        return (
            <div id="friends">
                <h2>Friends</h2>
                <div class="border" />
                <div id="friends__outer-box">
                    {!friends.length && (
                        <div>You don't have any friends yet!</div>
                    )}
                    {!!friends.length && friendsElem}
                </div>

                <h2>Pending Friend Requests</h2>
                <div class="border" />
                <div id="friends__outer-box">
                    {!pendingFriends.length && (
                        <div>You have no friend requests!</div>
                    )}
                    {!!pendingFriends.length && pendingFriendsElem}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Friends);
