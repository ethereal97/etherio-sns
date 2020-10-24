const app = {};

app.port = process.env.PORT || 3000;

app.bodyParser = {
    extended: true,
};

app.session = {
    cookie: {},
};

app.session.secret = process.env.COOKIE_SECRET || "keyboard cat";

app.session.saveUninitialized = true;

app.session.proxy = true;
app.session.resave = true;

if (process.env.NODE_ENV === "production") {
    app.session.secure = true;
}

module.exports = app;
