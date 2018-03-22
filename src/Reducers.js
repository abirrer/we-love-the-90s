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

    return state;
}
