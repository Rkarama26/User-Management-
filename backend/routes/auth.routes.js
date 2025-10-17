const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const { loginValidator, registerValidator } = require("../validators/validators");
const saltRounds = 10;
require("dotenv").config();


//  SIGNUP 
authRouter.post("/register", registerValidator, (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err) return res.status(500).json({ message: "Something went wrong" });

            await UserModel.create({ username, email, password: hash, role });
            res.status(201).json({ message: "Signup Success" });
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

//  LOGIN 
authRouter.post("/login", loginValidator, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found, please signup" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(403).json({ message: "Wrong Password" });

        // Access Token (15–20 min)
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" } // 15 minutes
        );
        res.status(200).json({
            message: "Login Success",
            accessToken,
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}); 


module.exports =  authRouter; 