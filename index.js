const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const { hashPassword, checkPassword } = require("./hash");
const {
    addNewUser,
    getPassword,
    addProfilePic,
    getUserProfile
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

//MIDDLEWARE

app.use(express.static("public"));

app.use(
    cookieSession({
        secret: process.env.SESSION_SECRET || require("./secrets").secret,
        maxAge: 1000 * 60 * 60 * 24 * 14 //this means 14 days of complete inactivity
    })
);

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
    console.log("inside POST welcome page", req.body);
    if (
        !req.body.first ||
        !req.body.last ||
        !req.body.email ||
        !req.body.password
    ) {
        console.log("error in post step 1/submission fields");
        res.json({
            success: false,
            error: "Please complete all fields before submitting."
        });
    } else {
        console.log("made it to post step 2");
        hashPassword(req.body.password)
            .then(hashedPassword => {
                console.log(hashedPassword);
                return addNewUser(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hashedPassword
                );
            })
            .then(result => {
                console.log(
                    "Results were uploaded & returned: ",
                    result.rows[0]
                );
                req.session.user = {
                    id: result.rows[0].id,
                    first: result.rows[0].first,
                    last: result.rows[0].last
                };
            })
            .then(() => {
                console.log("registration was complete");
                res.json({
                    success: true
                });
            })
            .catch(error => {
                console.log(
                    "there was an error somewhere in register POST request: ",
                    error
                );
                res.json({
                    success: false
                });
            });
    }
});

app.post("/welcome/login", (req, res) => {
    console.log("inside POST login page", req.body);
    if (!req.body.email || !req.body.password) {
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
                    console.log(result);
                    if (result == true) {
                        req.session.user = {
                            id: getPasswordResult.rows[0].id,
                            first: getPasswordResult.rows[0].first,
                            last: getPasswordResult.rows[0].last
                        };
                    } else {
                        res.json({
                            success: false,
                            error:
                                "Please complete all fields before submitting."
                        });
                    }
                })
                .then(() => {
                    res.json({
                        success: true
                    });
                })
                .catch(error => {
                    res.json({
                        success: false,
                        error: "Please complete all fields before submitting."
                    });
                });
        });
    }
});

app.get("/profile", (req, res) => {
    getUserProfile(req.session.user.id)
        .then(result => {
            console.log(result);
            // result.rows[0].profile_pic_url = config.s3Url + result.rows[0].image; //this is replaced by the concat within the res.json.
            result.rows[0].profile_pic_url =
                result.rows[0].profile_pic_url &&
                config.s3Url + result.rows[0].profile_pic_url;

            console.log("Profile pic: ", result.rows[0].profile_pic_url);

            res.json({
                id: result.rows[0].id,
                first: result.rows[0].first,
                last: result.rows[0].last,
                email: result.rows[0].email,
                profilepic: result.rows[0].profile_pic_url
            });
        })
        .catch(error => {
            console.log("error in /profile GET request: ", error);
        });
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

app.listen(8080, function() {
    console.log("I'm listening.");
});
