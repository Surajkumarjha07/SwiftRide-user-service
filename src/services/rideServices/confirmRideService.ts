import sendProducerMessage from "../../kafka/producers/producerTemplate.js";
import redis from "../../config/redis.js";

async function confirmRide(userId: string, fare: string, vehicle: string) {
    try {
        // redis cached data
        const rideData = await redis.hgetall(`rideData:${userId}`);
        rideData.fare = fare;
        rideData.vehicle = vehicle;
        await redis.hset(`rideData:${userId}`, rideData);

        // kafka message
        await sendProducerMessage("ride-request", { rideData });

    } catch (error) {
        if (error instanceof Error) {
            console.log("Ride request error: ", error.message);
        }
    }
}

export default confirmRide;