import { Request, Response } from "express";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";
import UserPayload from "../../types/userPayloads.js";

async function handlePaymentDone(req: Request, res: Response) {
    try {
        const { userId } = req.user as UserPayload;
        const { fare, payment_id, orderId, order, rideId, captainId } = req.body;
        console.log("order: " + orderId);

        // will be consumed by payments service
        await sendProducerMessage("payment-done", { fare, payment_id, orderId, order, userId, rideId, captainId });

        // will be consumed by gateway service
        await sendProducerMessage("payment-processed-notify-captain", { fare, payment_id, orderId, order, userId, rideId, captainId });

        res.status(200).json({
            message: "payment processed!"
        })

    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export default handlePaymentDone;
