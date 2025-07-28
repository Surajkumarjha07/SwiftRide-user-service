import { Router } from "express";
import handleRideRequest from "../controllers/rides.controllers/rideRequest.controller.js";
import authenticate from "../middlewares/userAuth.middleware.js";
import handleRideCancellation from "../controllers/rides.controllers/rideCancellation.controller.js";
import handleConfirmRide from "../controllers/rides.controllers/confirmRide.controller.js";
import handlePaymentDone from "../controllers/rides.controllers/payment.controller.js";
import handleCaptainNotAssigned from "../controllers/rides.controllers/captainNotAssigned.controller.js";
import handleUnconfirmedRide from "../controllers/rides.controllers/unConfirmedRide.controller.js";

const router = Router();

router.post("/ride-request", authenticate, handleRideRequest);
router.post("/cancel-ride", authenticate, handleRideCancellation);
router.post("/confirm-ride", authenticate, handleConfirmRide);
router.post("/captain-not-assigned", authenticate, handleCaptainNotAssigned);
router.post("/payment", authenticate, handlePaymentDone);
router.post("/process-unconfirmed-ride", authenticate, handleUnconfirmedRide);

export default router;