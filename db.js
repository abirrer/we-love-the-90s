var spicedPg = require("spiced-pg");

if (!process.env.DATABASE_URL) {
    var { dbUser, dbPass } = require("./secrets");
}

var db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUser}:${dbPass}@localhost:5432/socialnetwork`
);

//QUERIES

function addNewUser(first, last, email, password) {
    return db.query(
        `INSERT INTO users (first, last, email, hashed_password) VALUES ($1, $2, $3, $4) RETURNING *`,
        [first, last, email, password]
    );
}

function getPassword(email) {
    return db.query(
        `SELECT users.id, users.first, users.last, users.hashed_password FROM users WHERE email = $1`,
        [email]
    );
}

function updateProfilePic(id, profilePicUrl) {
    return db.query(
        `UPDATE users
        SET profile_pic_url = $2
        WHERE id = $1
        RETURNING *`,
        [id, profilePicUrl]
    );
}

function getUserProfile(id) {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
}

function updateBio(id, bio) {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING *`,
        [id, bio]
    );
}

function getOtherUserProfile(id) {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
}

exports.addNewUser = addNewUser;
exports.getPassword = getPassword;
exports.updateProfilePic = updateProfilePic;
exports.getUserProfile = getUserProfile;
exports.updateBio = updateBio;
exports.getOtherUserProfile = getOtherUserProfile;
