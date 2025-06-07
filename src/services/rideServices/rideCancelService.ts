import { isInRide } from "@prisma/client";
import redis from "../../config/redis.js";
import prisma from "../../config/database.js";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";

async function rideCancel(userId: string) {
    try {
        const rideData = await redis.hgetall(`rideData:${userId}`);

        await prisma.users.updateMany({
            where: { userId: userId, in_ride: isInRide.IN_RIDE },
            data: {
                in_ride: isInRide.NOT_IN_RIDE
            }
        })

        await sendProducerMessage("ride-cancelled", rideData);

        await redis.del(`rideData:${userId}`);

    } catch (error) {
        if (error instanceof Error) {
            console.log("Ride cancel service error: ", error.message);
        }
    }
}

export default rideCancel;