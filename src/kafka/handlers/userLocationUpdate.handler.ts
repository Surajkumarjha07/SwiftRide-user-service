import { EachMessagePayload } from "kafkajs";
import userLocationMap from "../../userLocationMap.js";
import redis from "../../config/redis.js";
import coords from "../../types/coordinates.type.js";

async function userLocationUpdateHandler({ message }: EachMessagePayload) {
    try {
        const { userId, coordinates }: { coordinates: coords, userId: string } = JSON.parse(message.value!.toString());

        const user_redis_coord = await redis.hgetall(`user-location-updates:${userId}`);

        const latitudeChanged: boolean = Number(user_redis_coord.latitude) !== coordinates.latitude;
        const longitudeChanged: boolean = Number(user_redis_coord.longitude) !== coordinates.longitude;

        if (!latitudeChanged && !longitudeChanged) return;

        await redis.hset(`user-location-updates:${userId}`, coordinates,);
        await redis.expire(`user-location-updates:${userId}`, 3600);
        userLocationMap.set(userId, coordinates);

    } catch (error) {
        throw new Error("Error in user-location-update handler: " + (error as Error).message);
    }
}

export default userLocationUpdateHandler;