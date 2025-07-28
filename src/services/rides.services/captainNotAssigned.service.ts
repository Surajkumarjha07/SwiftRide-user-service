import redis from "../../config/redis.js";
import sendProducerMessage from "../../kafka/producers/producerTemplate.js";

async function captainNotAssignedService(userId: string): Promise<boolean> {
    try {
        const rideData = await redis.hgetall(`rideData:${userId}`);
        const { rideId } = rideData;

        if (!Object.keys(rideData).includes("captainId")) {
            await sendProducerMessage("no-captain-assigned", { rideData });
            await redis.del(`rideData:${userId}`);
            await redis.del(`ride:${rideId}`);

            return false;
        }

        return true;

    } catch (error) {
        throw new Error("Error in captain-not-assigned service: " + (error as Error).message);
    }
}

export default captainNotAssignedService;