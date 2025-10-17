const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const UserModel = require("../models/user.model");

const userRouter = express.Router();

 //users - Admin can view all users
userRouter.get("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const users = await UserModel.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = userRouter;
