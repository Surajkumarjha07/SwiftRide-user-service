import { Request, Response } from "express";
import UserPayload from "../../types/userPayloads.js";
import { rideService } from "../../services/rideServices/index.js";

declare module "express-serve-static-core" {
    interface Request {
        user?: UserPayload
    }
}

async function handleRideCancellation(req: Request, res: Response) {
    try {
        const { userId } = req.user as UserPayload;

        if (!userId) {
            res.status(400).json({
                message: "token inavalid!"
            });
            return;
        }

        await rideService.rideCancel(userId);

        res.status(200).json({
            message: "ride cancellation successfull!"
        })

    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handleRideCancellation;