const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const { hashPassword, checkPassword } = require("./hash");
const { addNewUser, getPassword } = require("./db");

//MIDDLEWARE

app.use(express.static("public"));

app.use(
    cookieSession({
        secret: process.env.SESSION_SECRET || require("./secrets").secret,
        maxAge: 1000 * 60 * 60 * 24 * 14 //this means 14 days of complete inactivity
    })
);

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

//ROUTES

app.post("/welcome/register", (req, res) => {
    console.log("inside POST welcome page");
    if (
        !req.body.first ||
        !req.body.last ||
        !req.body.email ||
        !req.body.password
    ) {
        res.json({
            success: false
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
    if (!req.body.email || !req.body.password) {
        res.render("login", {
            error: true
        }); //need to update that error shows and test.
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
                            last: getPasswordResult.rows[0].last,
                            sigID: getPasswordResult.rows[0].sig_id
                        };
                        res.redirect("/thankyou");
                    } else {
                        res.render("login", {
                            error: true
                        });
                    }
                })
                .catch(error => {
                    console.log(
                        "There was an error in the login post request: ",
                        error
                    );
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
