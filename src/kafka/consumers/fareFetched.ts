import { ride_fare_consumer } from "../consumerInIt.js";
import fareFetchedHandler from "../handlers/fareFetchedHandler.js";

async function fareFetched() {
    try {
        await ride_fare_consumer.subscribe({topic: "fare-fetched", fromBeginning: true});
        await ride_fare_consumer.run({
            eachMessage: fareFetchedHandler
        })

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in getting ride-fare! ${error.message}`);
        }
    }
}

export default fareFetched;