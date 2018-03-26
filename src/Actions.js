import axios from "./axios";

export function receiveFriendsList() {
    return axios.get("/getfriends").then(function({ data }) {
        return {
            type: "RECEIVE_FRIENDS_LIST",
            users: data.users
        };
    });
}

export function makeFriend(id) {
    return axios
        .post("/updatefriendrequest", {
            otherId: id,
            friendshipStatus: 2
        })
        .then(() => {
            return {
                type: "MAKE_FRIEND",
                id: id
            };
        });
}

export function endFriendship(id) {
    return axios
        .post("/updatefriendrequest", {
            otherId: id,
            friendshipStatus: 4
        })
        .then(() => {
            return {
                type: "END_FRIENDSHIP",
                id: id
            };
        });
}

export function onlineUsers(onlineUsers) {
    return {
        type: "RECEIVE_ONLINE_USERS",
        onlineUsers
    };
}

export function userJoined(user) {
    return {
        type: "USER_JOINED",
        user
    };
}

export function userLeft(id) {
    console.log(id);
    return {
        type: "USER_LEFT",
        id
    };
}
