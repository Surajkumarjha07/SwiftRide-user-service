import { isInRide } from "@prisma/client";
import redisClient from "../../redis/redisClient.js";
import prisma from "../../prisma/prismaClient.js";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";

async function rideCancel(userId: string) {
    try {
        const rideData = await redisClient.hgetall(`rideData:${userId}`);

        await prisma.users.updateMany({
            where: { userId: userId, in_ride: isInRide.IN_RIDE },
            data: {
                in_ride: isInRide.NOT_IN_RIDE
            }
        })

        await sendProducerMessage("ride-cancelled", rideData);

        await redisClient.del(`rideData:${userId}`);

    } catch (error) {
        if (error instanceof Error) {
            console.log("Ride cancel service error: ", error.message);
        }
    }
}

export default rideCancel;