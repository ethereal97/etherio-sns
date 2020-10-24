const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    permission: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: true,
});

const User = model("User", UserSchema);

module.exports = User;