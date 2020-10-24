const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const configs = require("./configs");
const { render } = require("ejs");

const app = express();

mongoose
    .connect(configs.db.uri, configs.db.options)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log("Database Connection Failed", err));

app.set("view engine", "ejs");
if (configs.app.session.secure) {
    app.set("trust proxy", 1);
}
app.use(session(configs.app.session));
app.use(bodyParser.urlencoded(configs.app.bodyParser));
app.use(cookieParser());

app.use("/users", require("./routes/users"));

app.get("/", (req, res) => {
    if (!req.session.logged) {
        return res.redirect("/users/login");
    }
    return res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
    if (!req.session.logged) {
        return res.redirect("/users/login");
    }
    res.render("dashboard", req.session.logged);
});

app.listen(configs.app.port, () =>
    console.log(`server is running on http://localhost:${configs.app.port}`)
);
