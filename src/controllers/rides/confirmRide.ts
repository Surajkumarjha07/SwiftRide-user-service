import { Request, Response } from "express";
import UserPayload from "../../types/userPayloads.js";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";
import { rideService } from "../../services/rideServices/index.js";

async function handleConfirmRide(req: Request, res: Response) {
    try {
        const { userId } = req.user as UserPayload;
        const { fare, vehicle } = req.body;

        if (!userId) throw new Error("user not authorized!");

        await rideService.confirmRide(userId, fare, vehicle);

        res.status(200).json({
            message: "ride confirmation request sent successfully!"
        })

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in confirming ride: ${error.message}`);
        }
    }
}

export default handleConfirmRide;