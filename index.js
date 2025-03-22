import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello! Suraj, I am user-service");
})

//user-routes
app.use("/actions", userRoutes);

app.listen(process.env.PORT, () => {
    console.log("User service is running!");
})