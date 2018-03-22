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

function getFriendshipStatus(userId, otherUserId) {
    return db.query(
        `SELECT status, sender_id, recipient_id FROM friendships
        WHERE (recipient_id = $1 OR sender_id = $1)
        AND (recipient_id = $2 OR sender_id = $2)
        AND (status = 1 OR status = 2)`,
        [userId, otherUserId]
    );
}

function addFriendRequest(userId, otherUserId, friendshipStatus) {
    if (friendshipStatus == 0) {
        return db.query(
            `INSERT INTO friendships (sender_id, recipient_id, status)
            VALUES ($1, $2, 1)
            RETURNING *`,
            [userId, otherUserId]
        );
    } else if (
        friendshipStatus == 3 ||
        friendshipStatus == 4 ||
        friendshipStatus == 5
    ) {
        return db.query(
            `UPDATE friendships
            SET status = 1
            WHERE (recipient_id = $1 OR sender_id = $1)
            AND (recipient_id = $2 OR sender_id = $2)
            RETURNING *`,
            [userId, otherUserId]
        );
    }
}

function updateFriendRequest(userId, otherUserId, friendshipStatus) {
    return db.query(
        `UPDATE friendships
        SET status = $3
        WHERE (recipient_id = $1 OR sender_id = $1)
        AND (recipient_id = $2 OR sender_id = $2)
        AND (status = 1 OR status = 2)
        RETURNING *`,
        [userId, otherUserId, friendshipStatus]
    );
}

function getFriendList(userId) {
    return db.query(
        `SELECT users.id, users.first, users.last, users.profile_pic_url, friendships.status
        FROM friendships
        JOIN users
        ON (status = 1 AND recipient_id = $1 AND sender_id = users.id)
        OR (status = 2 AND recipient_id = $1 AND sender_id = users.id)
        OR (status = 2 AND sender_id = $1 AND recipient_id = users.id)`,
        [userId]
    );
}

exports.addNewUser = addNewUser;
exports.getPassword = getPassword;
exports.updateProfilePic = updateProfilePic;
exports.getUserProfile = getUserProfile;
exports.updateBio = updateBio;
exports.getOtherUserProfile = getOtherUserProfile;
exports.getFriendshipStatus = getFriendshipStatus;
exports.addFriendRequest = addFriendRequest;
exports.updateFriendRequest = updateFriendRequest;
exports.getFriendList = getFriendList;
