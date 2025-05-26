import { EachMessagePayload } from "kafkajs";
import prisma from "../../prisma/prismaClient.js";
import { isInRide } from "@prisma/client";
import redisClient from "../../redis/redisClient.js";

async function rideCompletedHandler({ message }: EachMessagePayload) {
    const { captainId, rideData } = JSON.parse(message.value!.toString());
    const { userId } = rideData;

    await prisma.users.update({
        where: { userId: userId },
        data: {
            in_ride: isInRide.NOT_IN_RIDE
        }
    });

    console.log(`${captainId} completed ${rideData.rideId}`);    

    await redisClient.del(`rideData:${userId}`);
}

export default rideCompletedHandler;