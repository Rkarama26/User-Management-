

const express = require('express');
const cors = require("cors");
const connectToDB = require('./configs/db.config');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const resourceRouter = require('./routes/resource.routes');
const profileRouter = require('./routes/profileRouter.routes');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;

connectToDB()
// Allow cross-origin requests
app.use(cors({
    origin: [process.env.ALLOWED_ORIGIN], // frontend origin(s)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use("/test", (req, res) => {
    try {
        res.status(200).json({ message: "this is my test routes " })
    } catch (error) {
        res.status(500).json({ error: error.message})

    }
})
// Handle preflight requests for all routes
// app.options("*", cors());

app.use(express.json());

app.use("/", authRouter)
app.use("/user", userRouter)
app.use("/profile", profileRouter)
app.use("/resources", resourceRouter)

app.listen(PORT, () => {
    console.log("server is running on port 3000")
}) 