import { isInRide } from "@prisma/client";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";
import prisma from "../../prisma/prismaClient.js";
import redisClient from "../../redis/redisClient.js";

async function confirmRide(userId: string) {
    try {
        // database update
        await prisma.users.update({
            where: {
                userId: userId
            },
            data: {
                in_ride: isInRide.IN_RIDE
            }
        })

        // redis cached data
        const rideData = await redisClient.hgetall(`rideData:${userId}`);
        console.log("rideData: " + Object.entries(rideData));

        // kafka message
        await sendProducerMessage("ride-request", rideData);

    } catch (error) {
        if (error instanceof Error) {
            console.log("Ride request error: ", error.message);
        }
    }
}

export default confirmRide;