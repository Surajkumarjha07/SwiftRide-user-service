import { Request, Response } from "express";
import UserPayload from "../../types/userPayloads.js";
import { rideService } from "../../services/rideServices/index.js";
import redis from "../../config/redis.js";

async function handleCaptainNotAssigned(req: Request, res: Response): Promise<any> {
    try {
        const { userId } = req.user as UserPayload;

        const captainAssigned = await rideService.captainNotAssignedService(userId);

        if (!captainAssigned) {
            return res.status(204).json({
                message: "captain not assigned"
            })
        }

        return res.status(200).json({
            message: "captain assigned"
        })

    } catch (error) {
        return res.status(500).json({
            error: (error as Error).message
        })
    }
}

export default handleCaptainNotAssigned;