import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import startKafka from "./kafka/index.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello! Suraj, I am user-service");
})

//user-routes
app.use("/actions", userRoutes);
app.use("/rides", rideRoutes);

//kafka handling
startKafka();

app.listen(Number(process.env.PORT), "0.0.0.0", () => {
    console.log("User service is running!");
})