import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import kafkaInit from "./kafkaAdmin.js";
import producer from "./producer.js";
import rideRoutes from "./routes/rideRoutes.js";

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
app.use("/rides", rideRoutes);

//kafka handling
(async () => {
    console.log("Initializing Kafka...");
    await kafkaInit();
    console.log("Kafka initialization done.");
})();

(async () => {
    console.log("Initializing Producer...");
    await producer.producerInit();
    console.log("Producer initialized.");
})();

app.listen(process.env.PORT, () => {
    console.log("User service is running!");
})