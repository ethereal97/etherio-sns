const database = {};

if (process.env.NODE_ENV === "development") {
    require("dotenv").config();
}

database.uri = process.env.DATABASE_URI;

database.options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
};

module.exports = database;