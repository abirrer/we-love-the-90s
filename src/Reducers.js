export default function(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_LIST") {
        state = Object.assign({}, state, {
            users: action.users
        });
    }

    if (action.type == "MAKE_FRIEND" || action.type == "END_FRIENDSHIP") {
        return {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        status: action.type == "MAKE_FRIEND" ? 2 : 4
                    };
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "RECEIVE_ONLINE_USERS") {
        return {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

    if (action.type == "USER_JOINED") {
        return {
            ...state,
            onlineUsers: [...state.onlineUsers, action.user]
        };
    }

    if (action.type == "USER_LEFT") {
        return {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

    return state;
}
