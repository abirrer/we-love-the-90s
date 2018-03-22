export default function(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_LIST") {
        state = Object.assign({}, state, {
            users: action.users
        });
    }

    if (action.type == "MAKE_FRIEND") {
        return {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        friend: true
                    };
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "END_FRIENDSHIP") {
        return {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        pendingFriend: true
                    };
                } else {
                    return user;
                }
            })
        };
    }

    return state;
}
