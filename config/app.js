const app = {};

app.port = process.env.PORT || 3000;

app.bodyParser = {
    extended: true,
};

app.session = {
    secret: "keyboard cat",
    cookie: {},
};

if (process.env.NODE_ENV === "production") {
    app.session.secure = true;
}

module.exports = app;