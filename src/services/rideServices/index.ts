import captainNotAssignedService from "./captainNotAssignedService.js";
import confirmRide from "./confirmRideService.js";
import rideCancel from "./rideCancelService.js";
import rideRequest from "./rideRequestService.js";

export const rideService = { rideRequest, rideCancel, confirmRide, captainNotAssignedService };