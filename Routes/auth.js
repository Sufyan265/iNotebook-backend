const express = require('express');
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "thisisanexamplesign"


// new request or response bhejny k liye ↓ 
// ROUTE 1: create a User using: POST "/api/auth/createuser". No login required ↓ 
router.post("/createuser", [
    // For validation ↓
    body('name').notEmpty(),
    // "email" k sath custom message bhi bhej skty he ↓ 
    body('email', "Please! Enter a valid email").isEmail(),
    body('password', "Please! Type password must be 6 crackters").isLength({ min: 6 })
], async (req, res) => {
    let success = false;

    // use of express velidater 
    const error = validationResult(req);
    // if there are errors its return bad request and errors ↓ 
    if (!error.isEmpty()) {
        return res.status(400).json({ success, error: error.array() })
    }
    try {
        // Check whether the user with this email exist already ↓ 
        let user = await User.findOne({ email: req.body.email })
        // console.log(user)
        if (user) {
            return res.status(400).json({ success, alreadyExist: true, error: "Sorry! a user with this email is already exist" })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)

        // module "User" ko data bhejny k liye ↓ 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            gender: req.body.gender,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true;
        // API response me data bhejny k liye ↓ 
        res.json({ success, authToken })

        // console.log(req.body)
        // // "User" module ko "req.body" bhejny k liye ↓ 
        // const user = User(req.body);

        // // For save in database ↓
        // user.save();
        // res.send(req.body);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 2: Login a User using: POST "/api/auth/login". No login required ↓ 
router.post("/login", [
    body('email', "Please! Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists()
], async (req, res) => {
    let success = false;

    // use of express velidater 
    const error = validationResult(req);
    // if there are errors its return bad request and errors ↓ 
    if (!error.isEmpty()) {
        return res.status(400).json({ success, errorArray: error.array(), error: "Please! enter valid Email and Password" })
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please! enter correct email and password" })
        }

        const passCompare = await bcrypt.compare(password, user.password)
        if (!passCompare) {
            return res.status(400).json({ success, error: "Please! enter correct email and password" })
        }
        const data = {
            user: {
                id: user.id
            }
        }        
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({ success, authToken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 3: Get loggedin user details using: POST "/api/auth/getuser". Login required ↓ 
router.post("/getuser", fetchuser, async (req, res) => {
    let success = false;

    try {
        const userId = req.user.id;
        // password k ilaawa baaki cheezy var "user" k ander store ho jay gi ↓ 
        const user = await User.findById(userId).select("-password");
        success = true;
        res.send({ success, user })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

router.post("/sufi", async (req, res) => {
    res.send("Sufyan")
})


module.exports = router