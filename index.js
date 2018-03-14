const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const { hashPassword, checkPassword } = require("./hash");
const { addNewUser, getPassword } = require("./db");
const csrf = require("csurf");

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
        console.log("error in post step 1");
        res.json({
            error: "Please complete all forms before submitting."
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
                console.log(result.rows[0]);
                req.session.user = {
                    id: result.rows[0].id,
                    first: result.rows[0].first,
                    last: result.rows[0].last
                };
            })
            .then(() => {
                res.json({
                    success: true
                });
            })
            .catch(error => {
                console.log(
                    "There was an error in the registration post request: ",
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
        res.render("login", {
            error: true
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
                            success: false
                        });
                    }
                })
                .then(() => {
                    res.json({
                        success: true
                    });
                })
                .catch(error => {
                    console.log(
                        "There was an error in the registration post request: ",
                        error
                    );
                    res.json({
                        success: false
                    });
                });
        });
    }
});

app.get("*", function(req, res) {
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
