import { user_location_update_consumer } from "../consumerInIt.js";
import userLocationUpdateHandler from "../handlers/userLocationUpdateHandler.js";

async function userLocationUpdate() {
    try {
        await user_location_update_consumer.subscribe({ topic: "user-location-update", fromBeginning: true });

        await user_location_update_consumer.run({
            eachMessage: userLocationUpdateHandler
        });

    } catch (error) {
        throw new Error("Error in user-location-update consumer: " + (error as Error).message);
    }
}

export default userLocationUpdate;