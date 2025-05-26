import { EachMessagePayload } from "kafkajs";
import redisClient from "../../redis/redisClient.js";

async function fareFetchedHandler({ message }: EachMessagePayload) {
    try {
        const { rideId, userId, pickUpLocation, destination, locationCoordinates, destinationCoordinates, fare } = JSON.parse(message.value!.toString());

        // redis caching for future inter-service transactions
        await redisClient.hmset(`rideData:${userId}`, {
            rideId,
            userId,
            pickUpLocation,
            destination,
            pickUpLocation_latitude: locationCoordinates.latitude,
            pickUpLocation_longitude: locationCoordinates.longitude,
            destination_latitude: destinationCoordinates.latitude,
            destination_longitude: destinationCoordinates.longitude,
            fare
        });

        //later we will emit socket events

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in fare fetching handler: ${error.message}`);
        }
    }
}

export default fareFetchedHandler;