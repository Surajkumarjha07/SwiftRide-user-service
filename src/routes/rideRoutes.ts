import { Router } from "express";
import handleRideRequest from "../controllers/rides/rideRequest.js";
import authenticate from "../middlewares/userAuth.js";
import handleRideCancellation from "../controllers/rides/rideCancellation.js";
import handleConfirmRide from "../controllers/rides/confirmRide.js";
import handlePaymentDone from "../controllers/rides/payment.js";

const router = Router();

router.post("/ride-request", authenticate, handleRideRequest);
router.post("/cancel-ride", authenticate, handleRideCancellation);
router.post("/confirm-ride", authenticate, handleConfirmRide);
router.post("/payment", authenticate, handlePaymentDone);

export default router;