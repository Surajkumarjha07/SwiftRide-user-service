import { Request, Response } from "express";
import UserPayload from "../../types/userPayload.type.js";
import redis from "../../config/redis.js";

async function handleUnconfirmedRide(req: Request, res: Response): Promise<any> {
    try {
        const { userId } = req.user as UserPayload;

        if (!userId) {
            return res.status(400).json({
                message: "Unauthorized Acsess!"
            })
        }

        await redis.del(`rideData:${userId}`);

        res.status(200).json({
            message: "ride data cleaned up!"
        })

    } catch (error) {
        return res.status(500).json({
            error: (error as Error).message
        })
    }
}

export default handleUnconfirmedRide;