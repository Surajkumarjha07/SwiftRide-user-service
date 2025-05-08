import sendProducerMessage from "../kafka/producers/producerTemplate.js";
import redisClient from "../redis/redisClient.js";

async function rideRequest({ id, location, destination }) {
    try {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklomnopqrstuvwxyz_-@#$&";
        let rideId = '';

        for (let i = 0; i < 30; i++) {
            let pos = Math.floor(Math.random() * alpha.length)
            rideId = rideId + alpha[pos];
        }

        // kafka message
        await sendProducerMessage("ride-request", { rideId, userId: id, pickUpLocation: location, destination, price: 200 });
        
        // redis cache
        await redisClient.hmset(`userRide:${id}`, { rideId, userId: id, pickUpLocation: location, destination, price: 200 });

    } catch (error) {
        console.log("Ride request error: ", error.message);
    }
}

async function rideCancel(id) {
    try {
        const rideCancelData = await redisClient.hgetall(`userRide:${id}`);
        console.log("rideCancelData: ", rideCancelData);
        
    } catch (error) {
        console.log("Ride cancel service error: ", error.message);
    }
}

export const rideService = { rideRequest, rideCancel };