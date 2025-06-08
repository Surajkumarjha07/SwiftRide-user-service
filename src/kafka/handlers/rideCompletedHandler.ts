import { EachMessagePayload } from "kafkajs";
import prisma from "../../config/database.js";
import { isInRide } from "@prisma/client";
import redis from "../../config/redis.js";

async function rideCompletedHandler({ message }: EachMessagePayload) {
    const { userId, captainId, rideId, fare } = JSON.parse(message.value!.toString());

    await prisma.users.update({
        where: {
            userId: userId
        },
        data: {
            in_ride: isInRide.NOT_IN_RIDE
        }
    });

    console.log(`${captainId} completed ${rideId}`);

    await redis.del(`rideData:${userId}`);
}

export default rideCompletedHandler;