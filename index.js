const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" }); //need to change this to be live on the internet.
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const { hashPassword, checkPassword } = require("./hash");
const {
    addNewUser,
    getPassword,
    updateProfilePic,
    getUserProfile,
    updateBio,
    getOtherUserProfile,
    getFriendshipStatus,
    addFriendRequest,
    updateFriendRequest,
    getFriendList,
    getUsersByIds,
    getUserById
} = require("./db");
const csrf = require("csurf");
const s3 = require("./s3");
const config = require("./config");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

let onlineUsers = [];
let messages = [];

//MIDDLEWARE

app.use(express.static("public"));

// app.use(
//     cookieSession({
//         secret: process.env.SESSION_SECRET || require("./secrets").secret,
//         maxAge: 1000 * 60 * 60 * 24 * 14 //this means 14 days of complete inactivity
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: process.env.SESSION_SECRET || require("./secrets").secret,
    maxAge: 1000 * 60 * 60 * 24 * 14 //this means 14 days of complete inactivity
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csrf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(cookieParser());

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(bodyParser.json());

//ROUTES

app.post("/welcome/register", (req, res) => {
    if (
        !req.body.first ||
        !req.body.last ||
        !req.body.email ||
        !req.body.password
    ) {
        console.log("new user register data fields were not complete");

        res.json({
            success: false,
            error: "Please complete all fields before submitting."
        });
    } else {
        hashPassword(req.body.password)
            .then(hashedPassword => {
                return addNewUser(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hashedPassword
                );
            })
            .then(result => {
                console.log("req.session was set successful");

                req.session.user = {
                    id: result.rows[0].id,
                    first: result.rows[0].first,
                    last: result.rows[0].last
                };
            })
            .then(() => {
                console.log("new user registration was complete");

                res.json({
                    success: true
                });
            })
            .catch(error => {
                console.log(
                    "there was an error somewhere in register POST request: ",
                    error
                );
            });
    }
});

app.post("/welcome/login", (req, res) => {
    if (!req.body.email || !req.body.password) {
        console.log("login fields were not complete");

        res.json({
            success: false,
            error: "Please complete all fields before submitting."
        });
    } else {
        getPassword(req.body.email).then(getPasswordResult => {
            checkPassword(
                req.body.password,
                getPasswordResult.rows[0].hashed_password
            )
                .then(result => {
                    if (result == true) {
                        req.session.user = {
                            id: getPasswordResult.rows[0].id,
                            first: getPasswordResult.rows[0].first,
                            last: getPasswordResult.rows[0].last
                        };
                    } else {
                        console.log(
                            "login fields were not valid and login failed"
                        );

                        res.json({
                            success: false,
                            error:
                                "Please complete all fields before submitting."
                        });
                    }
                })
                .then(() => {
                    console.log(
                        "user login verification was successful and req.sessions were set!"
                    );

                    res.json({
                        success: true
                    });
                })
                .catch(error => {
                    console.log("error in /profile GET request: ", error);
                });
        });
    }
});

app.get("/profile", (req, res) => {
    getUserProfile(req.session.user.id)
        .then(result => {
            console.log("user profile data pull was successful!");

            result.rows[0].profile_pic_url =
                result.rows[0].profile_pic_url &&
                config.s3Url + result.rows[0].profile_pic_url;

            res.json({
                success: true,
                id: result.rows[0].id,
                first: result.rows[0].first,
                last: result.rows[0].last,
                email: result.rows[0].email,
                profilepic: result.rows[0].profile_pic_url,
                bio: result.rows[0].bio
            });
        })
        .catch(error => {
            console.log("error in /profile GET request: ", error);
        });
});

app.post("/upload", uploader.single("profilepic"), s3.upload, (req, res) => {
    if (!req.file) {
        console.log("error because photo upload field not complete");

        res.json({
            success: false,
            error: "Please complete all fields before submitting."
        });
    } else {
        updateProfilePic(req.session.user.id, req.file.filename)
            .then(result => {
                console.log("profile pic upload success");

                res.json({
                    success: true,
                    profilepic: config.s3Url + result.rows[0].profile_pic_url
                }); //should also have a new url in it, it should call a function that sets its state and close the modal
            })
            .catch(error => {
                console.log("error in profilepic upload POST request: ", error);
            });
    }
});

app.post("/updateBio", (req, res) => {
    updateBio(req.session.user.id, req.body.bio)
        .then(result => {
            console.log("bio update was successful!");

            res.json({
                success: true,
                bio: result.rows[0].bio
            });
        })
        .catch(error => {
            console.log("error in updateBio POST request: ", error);
        });
});

app.get("/otherUser/:id", (req, res) => {
    if (req.session.user.id == req.params.id) {
        res.json({ sameProfile: true });
    } else {
        getOtherUserProfile(req.params.id)
            .then(result => {
                console.log("other user profile data pull was successful!");

                result.rows[0].profile_pic_url =
                    result.rows[0].profile_pic_url &&
                    config.s3Url + result.rows[0].profile_pic_url;

                res.json({
                    success: true,
                    otherId: result.rows[0].id,
                    otherFirst: result.rows[0].first,
                    otherLast: result.rows[0].last,
                    otherEmail: result.rows[0].email,
                    otherProfilepic: result.rows[0].profile_pic_url,
                    otherBio: result.rows[0].bio
                });
            })
            .catch(error => {
                console.log("error in /otherUser GET request: ", error);
            });
    }
});

app.get("/loadFriendButton/:otherId", (req, res) => {
    getFriendshipStatus(req.session.user.id, req.params.otherId)
        .then(result => {
            // console.log("result from initial query: ", result);
            if (!result.rows.length) {
                res.json({
                    friendshipStatus: 0
                });
            } else {
                console.log("friend button was loaded successful!");
                res.json({
                    senderId: result.rows[0].sender_id,
                    receiverId: result.rows[0].recipient_id,
                    friendshipStatus: result.rows[0].status
                });
            }
        })
        .catch(error => {
            console.log(
                "error in /loadFriendButton GET request: ",
                error,
                req.params.otherId,
                req.session.user.id
            );
        });
});

app.post("/sendfriendrequest", (req, res) => {
    addFriendRequest(
        req.session.user.id,
        req.body.receiverId,
        req.body.friendshipStatus
    )
        .then(result => {
            console.log("send friend request was successful!", result.rows[0]);

            res.json({
                senderId: result.rows[0].sender_id,
                receiverId: result.rows[0].recipient_id,
                friendshipStatus: result.rows[0].status
            });
        })
        .catch(error => {
            console.log("error in /sendfriendrequest POST request: ", error);
        });
});

app.post("/updatefriendrequest", (req, res) => {
    updateFriendRequest(
        req.session.user.id,
        req.body.otherId,
        req.body.friendshipStatus
    )
        .then(result => {
            console.log(
                "update friend request was successful!",
                result.rows[0]
            );

            res.json({
                senderId: result.rows[0].sender_id,
                receiverId: result.rows[0].recipient_id,
                friendshipStatus: result.rows[0].status
            });
        })
        .catch(error => {
            console.log("error in /updatefriendrequest POST request: ", error);
        });
});

app.get("/getfriends", (req, res) => {
    getFriendList(req.session.user.id)
        .then(result => {
            console.log("get friend list was successful! ", result.rows);

            result.rows.forEach(row => {
                return (row.profile_pic_url =
                    row.profile_pic_url && config.s3Url + row.profile_pic_url);
            });

            res.json({
                users: result.rows
            });
        })
        .catch(error => {
            console.log("error in /friends GET request: ", error);
        });
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/welcome/login");
});

app.get("*", (req, res) => {
    if (!req.session.user && req.url != "/welcome") {
        res.redirect("/welcome");
    } else if (req.session.user && req.url == "/welcome") {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});

io.on("connection", function(socket) {
    if (!socket.request.session || !socket.request.session.user) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.user.id;

    //check to see if they are in the list already before pushing.
    let index = onlineUsers.findIndex(function(obj) {
        return obj.userId == userId;
    });

    onlineUsers.push({
        userId,
        socketId: socket.id
    });

    let allOnlineUserIds = onlineUsers.map(user => user.userId);

    getUsersByIds(allOnlineUserIds).then(result => {
        result.rows.forEach(row => {
            return (row.profile_pic_url =
                row.profile_pic_url && config.s3Url + row.profile_pic_url);
        });

        socket.emit("onlineUsers", result.rows);
    });

    if (index == -1) {
        getUserById(socket.request.session.user.id).then(result => {
            result.rows.forEach(row => {
                return (row.profile_pic_url =
                    row.profile_pic_url && config.s3Url + row.profile_pic_url);
            });
            socket.broadcast.emit("userJoined", result.rows[0]);
        });
    }

    // Chat Message
    socket.emit("chatMessages", messages);

    socket.on("chatMessage", messageInfo => {
        let timestamp = new Date();

        const singleChatMessage = {
            userData: messageInfo.userData,
            timestamp: timestamp.toString(),
            messageText: messageInfo.message
        };

        messages.push(singleChatMessage);
        console.log(messages);

        io.sockets.emit("chatMessage", singleChatMessage);
    });
    // });

    socket.on("disconnect", function() {
        onlineUsers = onlineUsers.filter(user => user.socketId != socket.id);

        index = onlineUsers.findIndex(obj => {
            return obj.userId == userId;
        });

        if (index == -1) {
            io.sockets.emit("userLeft", userId);
        }
    });
});
