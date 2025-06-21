import { Request, Response } from "express";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";
import UserPayload from "../../types/userPayloads.js";

async function handlePaymentDone(req: Request, res: Response) {
    try {
        // const { userId } = req.user as UserPayload;
        const { fare, payment_id, orderId, order, userId, rideId, captainId } = req.body;
        console.log("order: " + orderId);

        await sendProducerMessage("payment-done", { fare, payment_id, orderId, order, userId, rideId, captainId });

        res.status(200).json({
            message: "payment processed!"
        })

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in payment controller: ${error.message}`);
        }
    }
}

export default handlePaymentDone;
