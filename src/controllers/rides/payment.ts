import { Request, Response } from "express";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";
import UserPayload from "../../types/userPayloads.js";

async function handlePaymentDone(req: Request, res: Response) {
    try {
        // const { userId } = req.user as UserPayload;
        const { userId, rideId, captainId, fare, payment_id } = req.body;

        await sendProducerMessage("payment-done", { userId, captainId, rideId, fare, payment_id });

        res.status(200).json({
            message: "payment processing"
        })

    } catch (error) {
        if (error instanceof Error) {   
            throw new Error(`Error in payment controller: ${error.message}`);
        }
    }
}

export default handlePaymentDone;
