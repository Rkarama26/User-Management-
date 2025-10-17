
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "moderator", "user"], default: "user" },
    createdAt: { type: Date, default: Date.now }

})

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;    