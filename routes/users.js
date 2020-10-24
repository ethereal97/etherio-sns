const { render } = require("ejs");
const express = require("express");
const session = require("express-session");
const { generate, verify } = require("password-hash");
const User = require("../app/User");

const router = express.Router();

//* GET /users/login
router.get("/login", (req, res) => {
    if (req.session.logged) {
        return res.redirect("/dashboard");
    }
    res.render("login");
});

router.post("/login", async(req, res) => {
    const { username, password } = req.body;
    const errors = [];

    if (!username) errors.push("Username is required!");
    if (!password) errors.push("Password is required!");

    if (errors.length > 0) {
        return res.render("login", { errors });
    }

    const user = await User.findOne({ username });

    if (!user) {
        errors.push("User does not exist");
        return res.render("login", { errors });
    }

    if (!verify(password, user.password)) {
        errors.push("Incorrect password!");
        return res.render("login", { username, errors });
    }

    user.password = null;

    req.session.logged = user;

    return res.redirect("/dashboard");
});

//* GET /users/register
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async(req, res) => {
    const { fullname, username, password, password_confirm, email } = req.body;
    const errors = [];

    fullname || errors.push("Fullname is required");
    username || errors.push("Username is required");
    password || errors.push("Password is required");
    password_confirm || errors.push("You must confirm your password");
    email || errors.push("Email is required");

    if (password !== password_confirm) {
        errors.push("Password does not match");
    }

    password.length < 8 &&
        errors.push("Password must contain at least 8 characters");
    password.match(/[0-9]/g) ||
        errors.push("Password must contain at least 1 number");
    password.match(/[a-z]/g) ||
        errors.push("Password must contain at least 1 lowercase letter");
    password.match(/[A-Z]/g) ||
        errors.push("Password must contain at least 1 uppercase letter");

    let permission = 1;

    if (errors.length > 0) {
        return res.render("register", { fullname, username, email, errors });
    }

    let user = new User({
        fullname,
        username,
        password: generate(password),
        email,
        permission,
    });

    try {
        user = await user.save();
        user.password = null;
        req.session.logged = user;
        res.redirect("/dashboard");
    } catch (err) {
        switch (err.code) {
            case 11000:
                errors.push("Username already existed");
                break;
            default:
                errors.push(err.message);
        }
        res.render("register", { fullname, username, email, errors });
    }
});

router.get("/logout", (req, res) => {
    req.session.logged = null;
    res.redirect("/user/login");
});

router.delete("/", async(req, res) => {
    if (!req.session.logged) {
        return res.status(401).end();
    }
    let { _id } = req.session.logged;
    try {
        let response = await User.findOneAndDelete({ _id });
        req.session.logged = null;
        res.status(202).end();
    } catch (err) {
        res.status(500).send(err.message).end();
    }
});

module.exports = router;