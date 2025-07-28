import captainNotAssignedService from "./captainNotAssigned.service.js";
import confirmRide from "./confirmRide.service.js";
import rideCancel from "./rideCancel.service.js";
import rideRequest from "./rideRequest.service.js";

export const rideService = { rideRequest, rideCancel, confirmRide, captainNotAssignedService };