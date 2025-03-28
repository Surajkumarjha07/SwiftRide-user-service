import { Router } from "express";
import handleRideRequest from "../controllers/rideRequest.js";
import authenticate from "../middlewares/userAuth.js";

const router = Router();

router.post("/ride-request", authenticate, handleRideRequest);

export default router;