import { Request, Response } from "express";
import UserPayload from "../../types/userPayloads.js";
import { rideService } from "../../services/rideServices/index.js";

async function handleRideRequest(req: Request, res: Response) {
    try {
        const { locationCoordinates, destinationCoordinates } = req.body;
        const { userId } = req.user as UserPayload;

        if (!userId) {
            res.status(404).json({
                message: "user not defined!"
            });
            return;
        }

        if (!locationCoordinates || !destinationCoordinates) {
            res.status(400).json({
                message: "locationCoordinates and destinationCoordinates are required!"
            });
            return;
        }

        await rideService.rideRequest({ userId, locationCoordinates, destinationCoordinates });

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