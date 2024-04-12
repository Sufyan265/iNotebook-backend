const jwt = require('jsonwebtoken');
require('dotenv').config();

// const JWT_SECRET = "thisisanexamplesign"
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    // Get user data from JWT Token and add id in req object ↓ 
    const token = req.header("auth-token");
    if (!token) {
       return res.status(401).send({ error: "Please authenticate using valid token" })
    }
    try {
        // For verify the token and JWT_SECRET ↓ 
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user;
        // next() mean jb ye (middleware) wala function run ho jay ga then next callback function run kr do ↓ 
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using valid token" })
    }
}

module.exports = fetchuser;