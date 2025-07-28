import { Request, Response } from "express";
import UserPayload from "../../types/userPayload.type.js";
import { rideService } from "../../services/rides.services/index.service.js";

async function handleRideRequest(req: Request, res: Response) {
    try {
        const { location, destination } = req.body;
        const { userId } = req.user as UserPayload;

        if (!userId) {
            res.status(404).json({
                message: "user not defined!"
            });
            return;
        }

        if (!location || !destination) {
            res.status(400).json({
                message: "locationCoordinates and destinationCoordinates are required!"
            });
            return;
        }

        await rideService.rideRequest({ userId, location, destination });

        res.status(200).json({
            message: "ride request sent successfully!"
        })

    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleRideRequest;