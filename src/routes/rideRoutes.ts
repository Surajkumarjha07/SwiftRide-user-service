import { Router } from "express";
import handleRideRequest from "../controllers/rides/rideRequest.js";
import authenticate from "../middlewares/userAuth.js";
import handleRideCancellation from "../controllers/rides/rideCancellation.js";

const router = Router();

router.post("/ride-request", authenticate, handleRideRequest);
router.post("/cancel-ride", authenticate, handleRideCancellation);

export default router;