import { Request, Response } from "express";
import UserPayload from "../../types/userPayloads.js";
import { rideService } from "../../services/rideServices/index.js";

async function handleRideRequest(req: Request, res: Response) {
    try {
        const { location, destination } = req.body;
        const { id } = req.user as UserPayload;

        if (!id) {
            res.status(404).json({
                message: "user not defined!"
            });
            return;
        }

        if (!location || !destination) {
            res.status(400).json({
                message: "location and destination are required!"
            });
            return;
        }

        await rideService.rideRequest({ id, location, destination });

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