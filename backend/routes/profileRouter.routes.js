const express = require("express");
const authMiddleware = require("../middleware/auth,.middleware");
const UserModel = require("../models/user.model");
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10; // same as signup


//  Get logged-in user's profile
profileRouter.get("/", authMiddleware(), async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-password"); // exclude password
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

//  Update logged-in user's profile
profileRouter.patch("/", authMiddleware(), async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (username) user.username = username; 
        if (email) user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            user.password = hashedPassword;
        }

        await user.save();

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
module.exports = profileRouter;
