import { isInRide } from "@prisma/client";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";
import prisma from "../../prisma/prismaClient.js";
import redisClient from "../../redis/redisClient.js";
import { rideRequestType } from "../../types/rideTypes.js";

async function rideRequest({ id, location, destination }: rideRequestType) {
    try {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
        let rideId = '';

        for (let i = 0; i < 30; i++) {
            let pos = Math.floor(Math.random() * alpha.length)
            rideId = rideId + alpha[pos];
        }

        // database update
        await prisma.users.update({
            where: {
                userId: id
            },
            data: {
                in_ride: isInRide.IN_RIDE
            }
        })

        // kafka message
        await sendProducerMessage("ride-request", { rideId, userId: id, pickUpLocation: location, destination, price: 200 });
        
        // redis cache
        await redisClient.hmset(`userRide:${id}`, { rideId, userId: id, pickUpLocation: location, destination, price: 200 });

    } catch (error) {
        if (error instanceof Error) {   
            console.log("Ride request error: ", error.message);
        }
    }
}

export default rideRequest;