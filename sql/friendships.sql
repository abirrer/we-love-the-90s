DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    status INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- 0. NO_REQUEST
-- 1. PENDING
-- 2. ACCEPTED
-- 3. REJECTED (receiver rejected request)
-- 4. UNFRIENDED (were friends and someone ended it)
-- 5. WITHDRAWN (sender withdrew/cancelled request)
